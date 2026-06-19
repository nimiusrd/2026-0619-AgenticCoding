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

        this.moveCountEl = document.getElementById('moveCount');
        this.minMovesEl = document.getElementById('minMoves');
        this.difficultySelect = document.getElementById('difficultySelect');
        this.resetBtn = document.getElementById('resetBtn');
        this.hintBtn = document.getElementById('hintBtn');
        this.autoSolveBtn = document.getElementById('autoSolveBtn');
        this.stopAutoBtn = document.getElementById('stopAutoBtn');
        this.speedSlider = document.getElementById('speedSlider');
        this.speedLabel = document.getElementById('speedLabel');
        this.autoSolveControl = document.getElementById('autoSolveControl');
        this.messageEl = document.getElementById('message');

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
        }
    }

    createDiskElement(size, rodIndex, position) {
        const disk = document.createElement('div');
        disk.className = `disk disk-${size}`;
        disk.textContent = size;
        disk.style.bottom = `${position * 45}px`;

        disk.addEventListener('click', () => this.selectDisk(size, rodIndex));

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
        const minMoves = Math.pow(2, this.numDisks) - 1;
        let message = `🎉 やった！クリア！\n移動回数: ${this.moveCount}回`;

        if (this.moveCount === minMoves) {
            message += `\n✨ パーフェクト！最小回数でクリアしました！`;
        } else {
            const extra = this.moveCount - minMoves;
            message += `\n💡 最小回数は${minMoves}回です。${extra}回多く動かしました。`;
        }

        this.showMessage(message, 'success');
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

// ゲーム開始
const game = new HanoiGame();
