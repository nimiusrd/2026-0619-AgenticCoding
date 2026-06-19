class HanoiGame {
    constructor() {
        this.rods = [[], [], []]; // 3つの棒
        this.moveCount = 0;
        this.selectedDisk = null;
        this.selectedRod = null;
        this.numDisks = 3;
        this.hintMoves = [];
        this.isAutoSolving = false;
        this.autoSolveSpeed = 800;
        this.optimalMoves = [];
        this.gameStartTime = null;
        this.gameTimer = null;

        this.moveCountEl = document.getElementById('moveCount');
        this.minMovesEl = document.getElementById('minMoves');
        this.clearTimeEl = document.getElementById('clearTime');
        this.difficultySelect = document.getElementById('difficultySelect');
        this.resetBtn = document.getElementById('resetBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.autoSolveBtn = document.getElementById('autoSolveBtn');
        this.stopAutoBtn = document.getElementById('stopAutoBtn');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedLabel = document.getElementById('speedLabel');
        this.autoSolveControl = document.getElementById('autoSolveControl');
        this.messageEl = document.getElementById('message');
        this.effectCanvas = document.getElementById('effectCanvas');

        this.setupEventListeners();
        this.initGame();
    }

    setupEventListeners() {
        this.difficultySelect.addEventListener('change', (e) => {
            this.numDisks = parseInt(e.target.value);
            this.initGame();
        });

        this.resetBtn.addEventListener('click', () => this.initGame());
        this.hintBtn.addEventListener('click', () => this.showHint());
        this.autoSolveBtn.addEventListener('click', () => this.startAutoSolve());
        this.stopAutoBtn.addEventListener('click', () => this.stopAutoSolve());
        
        this.speedSlider.addEventListener('change', (e) => {
            this.autoSolveSpeed = parseInt(e.target.value);
            this.updateSpeedLabel();
        });

        // 各棒にクリックイベントを追加
        for (let i = 0; i < 3; i++) {
            document.getElementById(`rod${i}`).addEventListener('click', (e) => {
                if (e.target.classList.contains('disk')) {
                    return; // ディスク自体がクリックされた場合はスキップ
                }
                this.selectRod(i);
            });
        }
    }

    initGame() {
        this.rods = [[], [], []];
        this.moveCount = 0;
        this.selectedDisk = null;
        this.selectedRod = null;
        this.hintMoves = [];
        this.isAutoSolving = false;
        this.autoSolveControl.style.display = 'none';
        this.autoSolveBtn.style.display = 'block';

        // タイマーをリセット
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }
        this.gameStartTime = Date.now();
        this.clearTimeEl.textContent = '0秒';

        // ディスクを初期位置に配置
        for (let i = this.numDisks; i >= 1; i--) {
            this.rods[0].push(i);
        }

        this.updateDisplay();
        this.updateMoveCount();
        this.clearMessage();

        // 最小回数を計算して表示
        const minMoves = Math.pow(2, this.numDisks) - 1;
        this.minMovesEl.textContent = minMoves;

        // 毎秒経過時間を更新
        this.gameTimer = setInterval(() => this.updateElapsedTime(), 1000);
    }

    updateElapsedTime() {
        const elapsedTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        
        if (minutes > 0) {
            this.clearTimeEl.textContent = `${minutes}分${seconds}秒`;
        } else {
            this.clearTimeEl.textContent = `${seconds}秒`;
        }
    }

    updateDisplay() {
        for (let rodIndex = 0; rodIndex < 3; rodIndex++) {
            const rodEl = document.getElementById(`rod${rodIndex}`);
            rodEl.innerHTML = '';

            for (let i = 0; i < this.rods[rodIndex].length; i++) {
                const diskSize = this.rods[rodIndex][i];
                const diskEl = this.createDiskElement(diskSize, rodIndex, i);
                rodEl.appendChild(diskEl);
            }

            // 棒のドラッグイベントを設定
            this.setupRodDragEvents(rodEl, rodIndex);
        }
    }

    setupRodDragEvents(rodEl, rodIndex) {
        rodEl.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            rodEl.classList.add('drag-over');
        });

        rodEl.addEventListener('dragleave', () => {
            rodEl.classList.remove('drag-over');
        });

        rodEl.addEventListener('drop', (e) => {
            e.preventDefault();
            rodEl.classList.remove('drag-over');
            
            try {
                const data = JSON.parse(e.dataTransfer.getData('application/json'));
                const { size, fromRod } = data;

                // 同じ棒へのドロップは無視
                if (fromRod === rodIndex) {
                    return;
                }

                // 棒の最上部のディスクが一致するかチェック
                if (this.rods[fromRod].length === 0 || this.rods[fromRod][this.rods[fromRod].length - 1] !== size) {
                    this.showMessage('⚠️ そのリングは動かせません！', 'warning');
                    return;
                }

                // 移動可能か確認
                if (this.canMove(size, rodIndex)) {
                    this.moveDisk(fromRod, rodIndex);
                    this.showMessage(`✨ リング ${size} を移動しました！`, 'hint');
                    this.deselectDisk();
                } else {
                    this.showMessage('❌ 大きなリングは小さなリングの上に置けません！', 'warning');
                }
            } catch (error) {
                console.error('Drop error:', error);
            }
        });
    }

    createDiskElement(size, rodIndex, position) {
        const disk = document.createElement('div');
        disk.className = `disk disk-${size}`;
        disk.textContent = size;
        disk.style.bottom = `${position * 45}px`;
        disk.draggable = true;

        // クリックイベント
        disk.addEventListener('click', () => this.selectDisk(size, rodIndex));

        // ドラッグイベント
        disk.addEventListener('dragstart', (e) => {
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('application/json', JSON.stringify({
                size: size,
                fromRod: rodIndex
            }));
            disk.classList.add('dragging');
        });

        disk.addEventListener('dragend', () => {
            disk.classList.remove('dragging');
        });

        return disk;
    }

    selectDisk(size, rodIndex) {
        // すでに選択されているディスクをクリックした場合はキャンセル
        if (this.selectedRod === rodIndex && this.selectedDisk === size) {
            this.deselectDisk();
            this.clearMessage();
            return;
        }

        // 別のディスクが選択されている場合
        if (this.selectedRod !== null) {
            // 別の棒の別のディスクをクリックした場合は選択を切り替え
            this.selectNewDisk(size, rodIndex);
            return;
        }

        // ディスクが棒の最上部にあるかチェック
        if (this.rods[rodIndex][this.rods[rodIndex].length - 1] === size) {
            this.selectedDisk = size;
            this.selectedRod = rodIndex;
            this.highlightSelectedDisk();
            this.showMessage(`✨ リング ${size} を選びました。移動先を選んでください。`, 'hint');
        } else {
            this.showMessage('⚠️ 上にあるリングを選んでください！', 'warning');
        }
    }

    selectNewDisk(size, rodIndex) {
        // 新しいディスクを選択（選択済みのディスクは自動的に置かれる場所を探す）
        if (this.rods[rodIndex][this.rods[rodIndex].length - 1] === size) {
            this.selectedDisk = size;
            this.selectedRod = rodIndex;
            this.highlightSelectedDisk();
            this.showMessage(`✨ リング ${size} を選びました。移動先を選んでください。`, 'hint');
        } else {
            this.showMessage('⚠️ 上にあるリングを選んでください！', 'warning');
        }
    }

    selectRod(rodIndex) {
        // 何も選択されていない場合
        if (this.selectedRod === null) {
            this.showMessage('⚠️ 最初にリングを選んでください！', 'warning');
            return;
        }

        // 同じ棒をクリックした場合
        if (this.selectedRod === rodIndex) {
            this.showMessage('⚠️ 別の棒を選んでください！', 'warning');
            return;
        }

        // 移動を試みる
        if (this.canMove(this.selectedDisk, rodIndex)) {
            this.moveDisk(this.selectedRod, rodIndex);
            this.showMessage(`✨ リング ${this.selectedDisk} を移動しました！`, 'hint');
            this.deselectDisk();
        } else {
            this.showMessage('❌ 大きなリングは小さなリングの上に置けません！', 'warning');
        }
    }

    canMove(selectedSize, targetRod) {
        // ターゲット棒が空の場合は常に移動可能
        if (this.rods[targetRod].length === 0) {
            return true;
        }
        // ターゲット棒の最上部にあるディスクが選択されたディスクより大きい場合のみ移動可能
        return this.rods[targetRod][this.rods[targetRod].length - 1] > selectedSize;
    }

    moveDisk(fromRod, toRod) {
        const disk = this.rods[fromRod].pop();
        this.rods[toRod].push(disk);
        this.moveCount++;
        this.updateDisplay();
        this.updateMoveCount();

        // クリア判定
        if (this.checkWin()) {
            this.showWinMessage();
        }
    }

    checkWin() {
        // すべてのディスクが3番目の棒にある
        return this.rods[2].length === this.numDisks;
    }

    showWinMessage() {
        // タイマーを停止
        if (this.gameTimer) {
            clearInterval(this.gameTimer);
        }

        const minMoves = Math.pow(2, this.numDisks) - 1;
        
        // クリアタイムを計算
        const elapsedTime = Math.floor((Date.now() - this.gameStartTime) / 1000);
        const minutes = Math.floor(elapsedTime / 60);
        const seconds = elapsedTime % 60;
        const timeString = minutes > 0 ? `${minutes}分${seconds}秒` : `${seconds}秒`;
        
        // UI に表示
        this.clearTimeEl.textContent = timeString;
        
        // メッセージ作成
        let message = `🎉 やった！クリア！\n移動回数: ${this.moveCount}回\n⏱️ クリアタイム: ${timeString}`;

        if (this.moveCount === minMoves) {
            message += `\n✨ パーフェクト！最小回数でクリアしました！`;
        } else {
            const extra = this.moveCount - minMoves;
            message += `\n💡 最小回数は${minMoves}回です。${extra}回多く動かしました。`;
        }

        this.showMessage(message, 'success');
        
        // エフェクトを表示
        new ConfettiEffect(this.effectCanvas);
    }

    highlightSelectedDisk() {
        const disks = document.querySelectorAll('.disk');
        disks.forEach(disk => disk.classList.remove('selected'));

        // 選択されたディスクをハイライト
        const selectedDisk = document.querySelector(`.rod#rod${this.selectedRod} .disk-${this.selectedDisk}`);
        if (selectedDisk) {
            selectedDisk.classList.add('selected');
        }
    }

    deselectDisk() {
        const disks = document.querySelectorAll('.disk');
        disks.forEach(disk => disk.classList.remove('selected'));
        this.selectedDisk = null;
        this.selectedRod = null;
    }

    updateMoveCount() {
        this.moveCountEl.textContent = this.moveCount;
    }

    showMessage(text, type = '') {
        this.messageEl.textContent = text;
        this.messageEl.className = `message ${type}`;
    }

    clearMessage() {
        this.messageEl.textContent = '';
        this.messageEl.className = 'message';
    }

    showHint() {
        const minMoves = Math.pow(2, this.numDisks) - 1;
        const currentMoves = this.moveCount;

        if (currentMoves >= minMoves) {
            this.showMessage('💡 すでに最小回数でクリアできます！がんばって！', 'hint');
        } else {
            const remaining = minMoves - currentMoves;
            this.showMessage(`💡 あと${remaining}回の移動でクリアできます！\n💪 右の棒にすべてのリングを移動させてね！`, 'hint');
        }
    }

    calculateOptimalMoves() {
        this.optimalMoves = [];
        this.hanoi(this.numDisks, 0, 2, 1);
        return this.optimalMoves;
    }

    hanoi(n, from, to, aux) {
        if (n === 1) {
            this.optimalMoves.push({ from, to });
        } else {
            this.hanoi(n - 1, from, aux, to);
            this.optimalMoves.push({ from, to });
            this.hanoi(n - 1, aux, to, from);
        }
    }

    async startAutoSolve() {
        if (this.isAutoSolving) return;

        this.isAutoSolving = true;
        this.autoSolveBtn.style.display = 'none';
        this.autoSolveControl.style.display = 'flex';
        this.difficultySelect.disabled = true;

        this.calculateOptimalMoves();
        this.showMessage(`🤖 最短解をシミュレート中... (${this.optimalMoves.length}回の移動)`, 'hint');

        for (let move of this.optimalMoves) {
            if (!this.isAutoSolving) break;

            // 移動するディスクを取得
            const fromRod = move.from;
            const toRod = move.to;

            if (this.rods[fromRod].length > 0) {
                this.moveDisk(fromRod, toRod);
            }

            // 次の移動まで待つ
            await new Promise(resolve => setTimeout(resolve, this.autoSolveSpeed));
        }

        if (this.isAutoSolving) {
            this.isAutoSolving = false;
            this.autoSolveControl.style.display = 'none';
            this.autoSolveBtn.style.display = 'block';
            this.difficultySelect.disabled = false;
        }
    }

    stopAutoSolve() {
        this.isAutoSolving = false;
        this.autoSolveControl.style.display = 'none';
        this.autoSolveBtn.style.display = 'block';
        this.difficultySelect.disabled = false;
        this.showMessage('⏹️ シミュレーションを中止しました', 'warning');
    }

    updateSpeedLabel() {
        const speed = this.autoSolveSpeed;
        if (speed <= 400) {
            this.speedLabel.textContent = '高速';
        } else if (speed <= 900) {
            this.speedLabel.textContent = '中速';
        } else if (speed <= 1500) {
            this.speedLabel.textContent = '低速';
        } else {
            this.speedLabel.textContent = '超低速';
        }
    }
}

// 紙吹雪エフェクトのクラス
class ConfettiEffect {
    constructor(canvas) {
        this.canvas = canvas;
        
        // キャンバスの確認
        if (!this.canvas) {
            console.error('Canvas element not found');
            return;
        }

        this.ctx = this.canvas.getContext('2d');
        if (!this.ctx) {
            console.error('Cannot get 2D context');
            return;
        }

        this.particles = [];
        this.animationId = null;

        // キャンバスのサイズを設定
        this.updateCanvasSize();

        // パーティクルを生成
        this.createParticles();

        // アニメーション開始
        this.animate();
    }

    updateCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        const particleCount = 60;
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8B94', '#667eea', '#764ba2', '#38ef7d', '#FF69B4', '#00CED1'];
        const emojis = ['🎉', '✨', '🎊', '⭐', '💫', '🌟'];

        for (let i = 0; i < particleCount; i++) {
            // 半分は四角い紙吹雪、半分は絵文字
            const useEmoji = Math.random() > 0.5;

            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: -30,
                size: Math.random() * 10 + 5,
                speedY: Math.random() * 4 + 2,
                speedX: (Math.random() - 0.5) * 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.3,
                opacity: 1,
                emoji: useEmoji ? emojis[Math.floor(Math.random() * emojis.length)] : null
            });
        }
    }

    animate() {
        // キャンバスをクリア
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let hasParticles = false;

        // パーティクルを更新・描画
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            particle.y += particle.speedY;
            particle.x += particle.speedX;
            particle.rotation += particle.rotationSpeed;
            particle.opacity -= 0.008;

            if (particle.opacity > 0 && particle.y < this.canvas.height) {
                this.drawParticle(particle);
                hasParticles = true;
            } else {
                this.particles.splice(i, 1);
            }
        }

        // パーティクルがまだ存在する場合は続ける
        if (hasParticles) {
            this.animationId = requestAnimationFrame(() => this.animate());
        }
    }

    drawParticle(particle) {
        this.ctx.save();
        this.ctx.globalAlpha = particle.opacity;
        this.ctx.translate(particle.x, particle.y);
        this.ctx.rotate(particle.rotation);

        if (particle.emoji) {
            // 絵文字を描画
            this.ctx.font = `${particle.size * 2}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(particle.emoji, 0, 0);
        } else {
            // 四角を描画
            this.ctx.fillStyle = particle.color;
            this.ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        }

        this.ctx.restore();
    }
}

// ゲーム開始
const game = new HanoiGame();
