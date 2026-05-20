<script>
    import { onMount } from 'svelte';
    import { gameStore, caseData } from '$lib/store.js';
    
    let currentView = $state('intro');
    let currentCaseNum = $state(null);
    let cases = $state({});
    let reflection = $state('');
    
    let selectedGuess = $state(null);
    let submitted = $state(false);
    
    let showInteractive = $state(false);
    let reflectionText = $state('');
    let reflectionSaved = $state(false);
    
    let typewriterText = $state('');
    let typewriterInterval = $state(null);
    
    onMount(() => {
        const unsubscribe = gameStore.subscribe(state => {
            currentView = state.currentView;
            currentCaseNum = state.currentCase;
            cases = state.cases;
            reflection = state.reflection;
        });
        gameStore.loadFromStorage();
        return unsubscribe;
    });
    
    let currentCase = $derived(currentCaseNum ? caseData[currentCaseNum - 1] : null);
    let canSubmit = $derived(selectedGuess !== null);
    let isCorrect = $derived(cases[currentCaseNum]?.guess === currentCase?.truth);
    
    function startGame() {
        gameStore.startGame();
        resetCaseState();
        startTypewriter(1);
    }
    
    function resetCaseState() {
        selectedGuess = null;
        submitted = false;
        showInteractive = false;
        reflectionText = cases[currentCaseNum]?.reflectionText || '';
        reflectionSaved = false;
        typewriterText = '';
        if (typewriterInterval) clearInterval(typewriterInterval);
    }
    
    function startTypewriter(caseNum) {
        const fragment = caseData[caseNum - 1].fragment;
        typewriterText = '';
        let i = 0;
        typewriterInterval = setInterval(() => {
            if (i < fragment.length) {
                typewriterText += fragment[i];
                i++;
            } else {
                clearInterval(typewriterInterval);
            }
        }, 20);
    }
    
    function selectGuess(guess) {
        selectedGuess = guess;
    }
    
    function submitGuess() {
        if (!selectedGuess) return;
        gameStore.submitGuess(currentCaseNum, selectedGuess);
        if (currentCaseNum === 8 && reflectionText) {
            gameStore.setReflection(reflectionText);
        }
        submitted = true;
    }
    
    function continueToNext() {
        showInteractive = false;
        if (currentCaseNum === 8) {
            gameStore.goToVerdict();
        } else {
            const nextCase = currentCaseNum + 1;
            gameStore.nextCase(currentCaseNum);
            setTimeout(() => {
                resetCaseState();
                startTypewriter(nextCase);
            }, 100);
        }
    }
    
    function getScore() {
        let correct = 0;
        for (let i = 1; i <= 7; i++) {
            if (cases[i]?.correct) correct++;
        }
        return correct;
    }
    
    function getBiasAnalysis() {
        const wrongHandwriting = cases[7]?.guess === 'AI';
        
        if (wrongHandwriting) {
            return "You under-trusted handwriting as evidence. That rigid schedule was human—just not Elena's. A machine didn't write it; an impostor did.";
        }
        return "Your judgment was balanced. But the case was never about right answers—it was about what the fragments hid.";
    }
    
    function goToResearch() {
        gameStore.goToResearch();
    }
    
    function goBackFromResearch() {
        gameStore.goBackFromResearch();
    }
    
    function saveReflection() {
        gameStore.setReflection(reflectionText);
        reflectionSaved = true;
    }
    
    function restart() {
        gameStore.restart();
    }
    
    function showConclusion() {
        document.getElementById('conclusion').style.display = 'block';
    }
</script>

<div class="badge">FORENSIC LINGUISTICS UNIT – CONFIDENTIAL</div>

<div class="container">
    {#if currentView === 'intro'}
        <div class="intro">
            <h1>THE "GHOSTWRITER"</h1>
            <p class="subtitle">CASE FILE: ELENA CLARK – ACCUSED FOR AI GHOSTWRITING</p>
            <div class="narrative">
                <p>You are Ben Reyes, senior forensic linguist at the State Bureau. A sealed dossier is placed on your desk. Novelist Elena Clark is accused of using AI in her latest novel, "Confession". The prosecution has submitted fragments for analysis.</p>
                <p>Your job is easy, just to determine whether each fragment is <strong>HUMAN</strong> or <strong>AI</strong>.</p>
                <p class="mystery">The truth is never as clean as the data suggests. Open the first case.</p>
            </div>
            <button class="stamp-button" onclick={startGame}>OPEN CASE 1</button>
            <button class="link-button" onclick={goToResearch}>Research Notes</button>
        </div>
    {:else if currentView.startsWith('case')}
        <div class="case-page">
            <h2>CASE {currentCaseNum}</h2>
            <p class="context">{currentCase?.context}</p>
            
            <div class="fragment">
                <pre>{typewriterText}</pre>
            </div>
            
            {#if !submitted}
                <div class="guess-ui">
                    <div class="guess-buttons">
                        <button 
                            class="guess-btn human" 
                            class:selected={selectedGuess === 'HUMAN'}
                            onclick={() => selectGuess('HUMAN')}
                        >
                            HUMAN
                        </button>
                        <button 
                            class="guess-btn ai" 
                            class:selected={selectedGuess === 'AI'}
                            onclick={() => selectGuess('AI')}
                        >
                            AI
                        </button>
                    </div>
                    
                    <button 
                        class="submit-btn" 
                        disabled={!canSubmit}
                        onclick={submitGuess}
                    >
                        REPORT
                    </button>
                </div>
            {:else}
                <div class="reveal">
                    <div class="truth" class:correct={isCorrect}>
                        <span class="truth-label">TRUTH:</span> This fragment is <strong>{currentCase?.truth}</strong>.
                    </div>
                    
                    <div class="forensic-note">
                        <div class="forensic-label">FORENSIC NOTE FROM BEN REYES</div>
                        <p>{currentCase?.forensic}</p>
                    </div>
                    
                    <div class="interactive-section">
                        {#if currentCase?.interactiveType === 'timeline'}
                            <button class="interactive-btn" onclick={() => showInteractive = !showInteractive}>
                                {currentCase.interactiveContent.buttonLabel}
                            </button>
                            {#if showInteractive}
                                <div class="interactive-reveal timeline">{currentCase.interactiveContent.reveal}</div>
                            {/if}
                        {:else if currentCase?.interactiveType === 'toggle'}
                            <button class="interactive-btn" onclick={() => showInteractive = !showInteractive}>
                                {currentCase.interactiveContent.buttonLabel}
                            </button>
                            {#if showInteractive}
                                <div class="interactive-reveal">{currentCase.interactiveContent.reveal}</div>
                            {/if}
                        {:else if currentCase?.interactiveType === 'buttons'}
                        {:else if currentCase?.interactiveType === 'dm'}
                            <button class="interactive-btn" onclick={() => showInteractive = !showInteractive}>
                                {currentCase.interactiveContent.buttonLabel}
                            </button>
                            {#if showInteractive}
                                <div class="interactive-reveal">{currentCase.interactiveContent.reveal}</div>
                            {/if}
                        {:else if currentCase?.interactiveType === 'histogram'}
                            <div class="histogram">
                                <pre>{currentCase.interactiveContent.reveal}</pre>
                            </div>
                        {:else if currentCase?.interactiveType === 'reflection'}
                            <div class="reflection-box">
                                <p class="reflection-prompt">{currentCase.interactiveContent.prompt}</p>
                                <textarea 
                                    bind:value={reflectionText} 
                                    placeholder="Type your reflection..."
                                    rows="4"
                                ></textarea>
                                {#if !reflectionSaved}
                                    <button class="save-reflection-btn" onclick={saveReflection}>Save Reflection</button>
                                {:else}
                                    <span class="saved-msg">Reflection saved</span>
                                {/if}
                            </div>
                        {/if}
                    </div>
                    
                    <div class="narrative-note">
                        <em>{currentCase?.narrative}</em>
                    </div>
                    
                    <button class="continue-btn" onclick={continueToNext}>
                        {currentCaseNum === 8 ? 'PROCEED TO VERDICT' : 'CONTINUE TO NEXT CASE'}
                    </button>
                </div>
            {/if}
        </div>
    {:else if currentView === 'verdict'}
        <div class="verdict-page">
            <h2>FINAL VERDICT</h2>
            <div class="score">
                <p>You correctly identified <strong>{getScore()}</strong> out of <strong>7</strong> fragments.</p>
            </div>
            
            <div class="bias-analysis">
                <p>{getBiasAnalysis()}</p>
            </div>
            
            <div class="final-choice">
                <p class="choice-prompt">Based on your analysis, what is your verdict on Elena Clark?</p>
                <div class="choice-buttons">
                    <button class="choice-btn yes" onclick={showConclusion}>
                        YES – SHE USED AI
                    </button>
                    <button class="choice-btn no" onclick={showConclusion}>
                        NO – SHE IS INNOCENT
                    </button>
                    <button class="choice-btn insufficient" onclick={showConclusion}>
                        INSUFFICIENT EVIDENCE
                    </button>
                </div>
            </div>
            
            <div id="conclusion" class="conclusion" style="display: none;">
                <p>"The alibi tapes never lie, but they never tell the whole truth. I was asked to find a machine behind the words. Instead, I found a sister. Elena Clark died on April 4, 2022. Her twin, Marisol, has been using AI to sustain her identity ever since. The texts, the emails, the cancelled events—all of them were recorded over a silence no one was meant to break. Forensic linguistics can tell you who didn't write something. It cannot tell you what to do with the truth when you find it."</p>
            </div>
            
            <button class="restart-btn" onclick={restart}>RESTART INVESTIGATION</button>
        </div>
    {:else if currentView === 'research'}
        <div class="research-page">
            <h2>Research Notes</h2>
            <div class="citations">
                <div class="citation">Case 1: Vance, E. (2025). "Confession", Chapter 1. Stylometric analysis report #2025-042.</div>
                <div class="citation">Case 2: Clark, E. (2022, March 31). "Weekend Plans". Elena Clark Official Blog. [Archived]</div>
                <div class="citation">Case 3: Clark, E. (2022, April 4). iMessage chat log with Mother. iCloud backup #C4-0902.</div>
                <div class="citation">Case 4: Clark, E. (2022, April 4). iMessage chat log, 21:17. Flagged as AI-generated by Linguistic Fingerprint Tool.</div>
                <div class="citation">Case 5: Rooney, D. (2022, April 5). Facebook post. Metadata & DM recovered from marina Wi-Fi logs.</div>
                <div class="citation">Case 6: Clark, E. (2022, April 5). Email "Regrettable absence". Sent via ProtonMail, source IP traced to Clark residence.</div>
                <div class="citation">Case 7: Handwritten note "Daily Rhythm". Evidence tag #CLARK-07. Graphological comparison to Marisol Clark exemplar.</div>
                <div class="citation">Case 8: Vance, E. (2025). "Confession", final chapter. Authorship attribution report (Marisol Clark, 94% match).</div>
            </div>
            <button class="back-btn" onclick={goBackFromResearch}>Back</button>
        </div>
    {/if}
</div>

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        background-color: #1a1a1a;
        background-image: 
            repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(255,255,255,0.03) 2px,
                rgba(255,255,255,0.03) 4px
            );
        min-height: 100vh;
        font-family: Georgia, 'Times New Roman', serif;
        color: #f5e6d3;
    }
    
    .badge {
        position: fixed;
        top: 20px;
        left: 20px;
        background: #8b0000;
        color: #f5e6d3;
        padding: 10px 15px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 12px;
        border: 2px solid #f5e6d3;
        border-radius: 4px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.5);
    }
    
    .container {
        max-width: 700px;
        margin: 0 auto;
        padding: 80px 20px 40px;
    }
    
    h1 {
        font-family: 'Arial Narrow', 'Helvetica Neue', sans-serif;
        font-size: 3em;
        text-align: center;
        letter-spacing: 4px;
        margin-bottom: 10px;
        color: #f5e6d3;
    }
    
    h2 {
        font-family: 'Arial Narrow', 'Helvetica Neue', sans-serif;
        font-size: 2em;
        text-align: center;
        letter-spacing: 2px;
        color: #8b0000;
        border-bottom: 2px solid #8b0000;
        padding-bottom: 10px;
        margin-bottom: 20px;
    }
    
    .subtitle {
        text-align: center;
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.9em;
        color: #a0a0a0;
        margin-bottom: 30px;
    }
    
    .narrative {
        background: rgba(40,40,40,0.8);
        border: 1px solid #444;
        padding: 20px;
        margin-bottom: 30px;
        line-height: 1.8;
    }
    
    .narrative p {
        margin-bottom: 15px;
    }
    
    .mystery {
        font-style: italic;
        color: #c0c0c0;
    }
    
    .stamp-button {
        display: block;
        width: 100%;
        padding: 15px 30px;
        background: #8b0000;
        color: #f5e6d3;
        border: 3px solid #f5e6d3;
        font-family: 'Courier New', Courier, monospace;
        font-size: 1.2em;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(139,0,0,0.5);
    }
    
    .stamp-button:hover {
        transform: scale(1.02);
        box-shadow: 0 6px 20px rgba(139,0,0,0.7);
    }
    
    .link-button {
        display: block;
        margin: 20px auto 0;
        background: none;
        border: none;
        color: #888;
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.9em;
        cursor: pointer;
        text-decoration: underline;
    }
    
    .link-button:hover {
        color: #aaa;
    }
    
    .context {
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.85em;
        color: #a0a0a0;
        text-align: center;
        margin-bottom: 20px;
    }
    
    .fragment {
        background: #2a2a2a;
        border: 1px solid #444;
        padding: 20px;
        margin-bottom: 30px;
        min-height: 150px;
    }
    
    .fragment pre {
        font-family: 'Courier New', Courier, monospace;
        white-space: pre-wrap;
        font-size: 1em;
        line-height: 1.6;
    }
    
    .guess-ui {
        background: rgba(40,40,40,0.8);
        border: 1px solid #444;
        padding: 25px;
    }
    
    .guess-buttons {
        display: flex;
        gap: 20px;
        margin-bottom: 25px;
    }
    
    .guess-btn {
        flex: 1;
        padding: 20px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 1.3em;
        font-weight: bold;
        border: 2px solid;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .guess-btn.human {
        background: #1a3a1a;
        border-color: #4a8a4a;
        color: #4a8a4a;
    }
    
    .guess-btn.human:hover,
    .guess-btn.human.selected {
        background: #4a8a4a;
        color: #fff;
    }
    
    .guess-btn.ai {
        background: #3a1a1a;
        border-color: #8b0000;
        color: #8b0000;
    }
    
    .guess-btn.ai:hover,
    .guess-btn.ai.selected {
        background: #8b0000;
        color: #fff;
    }
    
    .submit-btn {
        width: 100%;
        padding: 15px;
        background: #8b0000;
        color: #f5e6d3;
        border: none;
        font-family: 'Courier New', Courier, monospace;
        font-size: 1.1em;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .submit-btn:not(:disabled):hover {
        animation: pulse 1s infinite;
    }
    
    .submit-btn:disabled {
        background: #444;
        color: #666;
        cursor: not-allowed;
    }
    
    @keyframes pulse {
        0%, 100% { box-shadow: 0 0 0 0 rgba(139,0,0,0.7); }
        50% { box-shadow: 0 0 0 10px rgba(139,0,0,0); }
    }
    
    .reveal {
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .truth {
        background: #2a2a2a;
        border: 2px solid #8b0000;
        padding: 15px;
        margin-bottom: 20px;
        font-size: 1.1em;
    }
    
    .truth.correct {
        border-color: #2a7a2a;
    }
    
    .truth-label {
        color: #8b0000;
        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
    }
    
    .truth.correct .truth-label {
        color: #2a7a2a;
    }
    
    .forensic-note {
        background: #f5e6d3;
        color: #1a1a1a;
        padding: 20px;
        margin-bottom: 20px;
        border-left: 4px solid #8b0000;
    }
    
    .forensic-label {
        font-family: 'Courier New', Courier, monospace;
        font-weight: bold;
        font-size: 0.85em;
        color: #8b0000;
        margin-bottom: 10px;
    }
    
    .forensic-note p {
        font-family: 'Courier New', Courier, monospace;
        line-height: 1.7;
    }
    
    .interactive-section {
        margin-bottom: 20px;
    }
    
    .interactive-btn {
        background: #333;
        color: #f5e6d3;
        border: 1px solid #555;
        padding: 10px 15px;
        font-family: 'Courier New', Courier, monospace;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .interactive-btn:hover {
        background: #444;
        border-color: #888;
    }
    
    .interactive-reveal {
        background: #222;
        border: 1px solid #444;
        padding: 15px;
        margin-top: 10px;
        font-family: 'Courier New', Courier, monospace;
        line-height: 1.6;
    }
    
    .timeline {
        white-space: pre-line;
    }
    
    .histogram {
        background: #222;
        border: 1px solid #444;
        padding: 15px;
    }
    
    .histogram pre {
        font-family: 'Courier New', Courier, monospace;
        white-space: pre-wrap;
        line-height: 1.6;
    }
    
    .reflection-box {
        background: #2a2a2a;
        border: 1px solid #444;
        padding: 15px;
    }
    
    .reflection-prompt {
        font-style: italic;
        margin-bottom: 10px;
        line-height: 1.5;
    }
    
    .reflection-box textarea {
        width: 100%;
        background: #1a1a1a;
        color: #f5e6d3;
        border: 1px solid #444;
        padding: 10px;
        font-family: 'Courier New', Courier, monospace;
        resize: vertical;
    }
    
    .save-reflection-btn {
        margin-top: 10px;
        background: #333;
        color: #f5e6d3;
        border: 1px solid #555;
        padding: 8px 15px;
        font-family: 'Courier New', Courier, monospace;
        cursor: pointer;
    }
    
    .save-reflection-btn:hover {
        background: #444;
    }
    
    .saved-msg {
        display: inline-block;
        margin-top: 10px;
        color: #4a8a4a;
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.9em;
    }
    
    .narrative-note {
        background: rgba(40,40,40,0.5);
        border-left: 3px solid #555;
        padding: 15px;
        margin-bottom: 25px;
        font-style: italic;
        color: #a0a0a0;
    }
    
    .continue-btn {
        width: 100%;
        padding: 15px;
        background: #333;
        color: #f5e6d3;
        border: 2px solid #555;
        font-family: 'Courier New', Courier, monospace;
        font-size: 1em;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .continue-btn:hover {
        background: #444;
        border-color: #888;
    }
    
    .verdict-page h2 {
        color: #f5e6d3;
    }
    
    .score {
        text-align: center;
        font-size: 1.3em;
        margin-bottom: 30px;
        padding: 20px;
        background: rgba(40,40,40,0.8);
        border: 1px solid #444;
    }
    
    .bias-analysis {
        background: #2a2a2a;
        border: 1px solid #555;
        padding: 20px;
        margin-bottom: 30px;
        font-style: italic;
        line-height: 1.7;
    }
    
    .final-choice {
        margin-bottom: 30px;
    }
    
    .choice-prompt {
        text-align: center;
        font-size: 1.1em;
        margin-bottom: 20px;
    }
    
    .choice-buttons {
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    .choice-btn {
        padding: 15px;
        font-family: 'Courier New', Courier, monospace;
        font-size: 1em;
        font-weight: bold;
        border: 2px solid;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .choice-btn.yes {
        background: #3a1a1a;
        border-color: #8b0000;
        color: #8b0000;
    }
    
    .choice-btn.no {
        background: #1a3a1a;
        border-color: #4a8a4a;
        color: #4a8a4a;
    }
    
    .choice-btn.insufficient {
        background: #4a4a1a;
        border-color: #c9c900;
        color: #c9c900;
    }
    
    .choice-btn:hover {
        transform: scale(1.02);
    }
    
    .conclusion {
        background: #f5e6d3;
        color: #1a1a1a;
        padding: 25px;
        margin: 30px 0;
        border-left: 4px solid #8b0000;
        animation: fadeIn 0.5s ease;
    }
    
    .conclusion p {
        line-height: 1.8;
        font-style: italic;
    }
    
    .restart-btn {
        width: 100%;
        padding: 15px;
        background: #333;
        color: #f5e6d3;
        border: 2px solid #555;
        font-family: 'Courier New', Courier, monospace;
        font-size: 1em;
        cursor: pointer;
        margin-top: 20px;
    }
    
    .restart-btn:hover {
        background: #444;
    }
    
    .research-page h2 {
        color: #f5e6d3;
        margin-bottom: 30px;
    }
    
    .citations {
        background: rgba(40,40,40,0.8);
        border: 1px solid #444;
        padding: 20px;
    }
    
    .citation {
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.9em;
        margin-bottom: 15px;
        line-height: 1.5;
        white-space: normal;
        word-wrap: break-word;
        overflow-wrap: break-word;
    }
    
    .back-btn {
        margin-top: 20px;
        padding: 10px 20px;
        background: #333;
        color: #f5e6d3;
        border: 1px solid #555;
        font-family: 'Courier New', Courier, monospace;
        cursor: pointer;
    }
    
    .back-btn:hover {
        background: #444;
    }
</style>