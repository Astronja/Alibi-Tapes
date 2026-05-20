import "../../chunks/index-server.js";
import { C as writable, F as attr, I as escape_html, n as attr_class, r as derived } from "../../chunks/dev.js";
import "../../chunks/index-server2.js";
var groundTruth = [
	"AI",
	"HUMAN",
	"HUMAN",
	"HUMAN",
	"HUMAN",
	"AI",
	"HUMAN"
];
function createGameStore() {
	const { subscribe, set, update } = writable({
		currentView: "intro",
		currentCase: null,
		cases: {},
		reflection: ""
	});
	return {
		subscribe,
		startGame: () => {
			update((state) => ({
				...state,
				currentView: "case1",
				currentCase: 1
			}));
		},
		submitGuess: (caseNum, guess) => {
			const correct = groundTruth[caseNum - 1] === guess;
			update((state) => ({
				...state,
				cases: {
					...state.cases,
					[caseNum]: {
						guess,
						correct
					}
				}
			}));
			localStorage.setItem(`case${caseNum}`, JSON.stringify({
				guess,
				correct
			}));
		},
		setReflection: (text) => {
			update((state) => ({
				...state,
				reflection: text
			}));
			localStorage.setItem("reflection", text);
		},
		loadFromStorage: () => {
			const cases = {};
			for (let i = 1; i <= 8; i++) {
				const stored = localStorage.getItem(`case${i}`);
				if (stored) cases[i] = JSON.parse(stored);
			}
			const reflection = localStorage.getItem("reflection") || "";
			update((state) => ({
				...state,
				cases,
				reflection
			}));
		},
		goToVerdict: () => {
			update((state) => ({
				...state,
				currentView: "verdict"
			}));
		},
		goToResearch: () => {
			update((state) => ({
				...state,
				currentView: "research"
			}));
		},
		goBackFromResearch: () => {
			update((state) => ({
				...state,
				currentView: "intro"
			}));
		},
		nextCase: (caseNum) => {
			if (caseNum < 8) update((state) => ({
				...state,
				currentView: `case${caseNum + 1}`,
				currentCase: caseNum + 1
			}));
			else update((state) => ({
				...state,
				currentView: "verdict"
			}));
		},
		restart: () => {
			localStorage.clear();
			set({
				currentView: "intro",
				currentCase: null,
				cases: {},
				reflection: ""
			});
		}
	};
}
createGameStore();
//#endregion
//#region src/routes/+page.svelte
function _page($$renderer, $$props) {
	$$renderer.component(($$renderer) => {
		let currentView = "intro";
		let currentCaseNum = null;
		let cases = {};
		let selectedGuess = null;
		let finalChoice = null;
		let typewriterText = "";
		let currentCase = derived(() => null);
		let canSubmit = derived(() => selectedGuess !== null);
		derived(() => cases[currentCaseNum]?.guess === currentCase()?.truth);
		function getScore() {
			let correct = 0;
			for (let i = 1; i <= 7; i++) if (cases[i]?.correct) correct++;
			return correct;
		}
		function getBiasAnalysis() {
			if (cases[7]?.guess === "AI") return "You under-trusted handwriting as evidence. That rigid schedule was human—just not Elena's. A machine didn't write it; an impostor did.";
			return "Your judgment was balanced. But the case was never about right answers—it was about what the fragments hid.";
		}
		$$renderer.push(`<div class="badge svelte-1uha8ag">FORENSIC LINGUISTICS UNIT – CONFIDENTIAL</div> <div class="container svelte-1uha8ag">`);
		if (currentView === "intro") {
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="intro svelte-1uha8ag"><h1 class="svelte-1uha8ag">THE "GHOSTWRITER"</h1> <p class="subtitle svelte-1uha8ag">CASE FILE: ELENA CLARK – ACCUSED FOR AI GHOSTWRITING</p> <div class="narrative svelte-1uha8ag"><p class="svelte-1uha8ag">You are Ben Reyes, senior forensic linguist at the State Bureau. A sealed dossier is placed on your desk. Novelist Elena Clark is accused of using AI in her latest novel, "Confession". The prosecution has submitted fragments for analysis.</p> <p class="svelte-1uha8ag">Your job is easy, just to determine whether each fragment is <strong class="svelte-1uha8ag">HUMAN</strong> or <strong class="svelte-1uha8ag">AI</strong>.</p> <p class="mystery svelte-1uha8ag">The truth is never as clean as the data suggests. Open the first case.</p></div> <button class="stamp-button svelte-1uha8ag">OPEN CASE 1</button> <button class="link-button svelte-1uha8ag">Research Notes</button></div>`);
		} else if (currentView.startsWith("case")) {
			$$renderer.push("<!--[1-->");
			$$renderer.push(`<div class="case-page svelte-1uha8ag"><h2 class="svelte-1uha8ag">CASE ${escape_html(currentCaseNum)}</h2> <p class="context svelte-1uha8ag">${escape_html(currentCase()?.context)}</p> <div class="fragment svelte-1uha8ag"><pre class="svelte-1uha8ag">${escape_html(typewriterText)}</pre></div> `);
			$$renderer.push("<!--[0-->");
			$$renderer.push(`<div class="guess-ui svelte-1uha8ag"><div class="guess-buttons svelte-1uha8ag"><button${attr_class("guess-btn human svelte-1uha8ag", void 0, { "selected": selectedGuess === "HUMAN" })}>HUMAN</button> <button${attr_class("guess-btn ai svelte-1uha8ag", void 0, { "selected": selectedGuess === "AI" })}>AI</button></div> <button class="submit-btn svelte-1uha8ag"${attr("disabled", !canSubmit(), true)}>REPORT</button></div>`);
			$$renderer.push(`<!--]--></div>`);
		} else if (currentView === "verdict") {
			$$renderer.push("<!--[2-->");
			$$renderer.push(`<div class="verdict-page svelte-1uha8ag"><h2 class="svelte-1uha8ag">FINAL VERDICT</h2> <div class="score svelte-1uha8ag"><p class="svelte-1uha8ag">You correctly identified <strong class="svelte-1uha8ag">${escape_html(getScore())}</strong> out of <strong class="svelte-1uha8ag">7</strong> fragments.</p></div> <div class="bias-analysis svelte-1uha8ag"><p class="svelte-1uha8ag">${escape_html(getBiasAnalysis())}</p></div> <div class="final-choice svelte-1uha8ag"><p class="choice-prompt svelte-1uha8ag">Based on your analysis, what is your verdict on Elena Clark?</p> <div id="choice-buttons" class="choice-buttons svelte-1uha8ag"><button class="choice-btn yes svelte-1uha8ag">YES – SHE USED AI</button> <button class="choice-btn no svelte-1uha8ag">NO – SHE IS INNOCENT</button> <button class="choice-btn insufficient svelte-1uha8ag">INSUFFICIENT EVIDENCE</button></div></div> <div id="outcome-container" class="outcome-container svelte-1uha8ag" style="display: none;">`);
			if (finalChoice === "AI") {
				$$renderer.push("<!--[0-->");
				$$renderer.push(`<div class="court-ruling svelte-1uha8ag"><div class="ruling-header svelte-1uha8ag">OFFICIAL RULING</div> <p class="svelte-1uha8ag">The literary board has determined that Elena Clark utilized artificial intelligence in the composition of her novel "Confession". All associated royalties are forfeited, and the work has been stricken from her official bibliography. The investigation did not uncover the identity fraud.</p></div> <div class="star-rating svelte-1uha8ag">★★☆</div> <div class="thoughtful-comment svelte-1uha8ag"><p class="svelte-1uha8ag">"You caught the AI, but left with a story unrevealed, perhaps forever."</p></div>`);
			} else if (finalChoice === "INNOCENT") {
				$$renderer.push("<!--[1-->");
				$$renderer.push(`<div class="court-ruling svelte-1uha8ag"><div class="ruling-header svelte-1uha8ag">OFFICIAL RULING</div> <p class="svelte-1uha8ag">Elena Clark is acquitted of all AI-plagiarism charges. The evidence was deemed inconclusive, and her literary reputation remains intact. No further investigation into the authorship of the fragments will be pursued.</p></div> <div class="star-rating svelte-1uha8ag">★☆☆</div> <div class="thoughtful-comment svelte-1uha8ag"><p class="svelte-1uha8ag">"You trusted the human warmth, but that warmth was a lie and you have never noticed."</p></div>`);
			} else if (finalChoice === "INSUFFICIENT") {
				$$renderer.push("<!--[2-->");
				$$renderer.push(`<div class="court-ruling svelte-1uha8ag"><div class="ruling-header svelte-1uha8ag">OFFICIAL RULING</div> <p class="svelte-1uha8ag">Due to insufficient evidence, no formal charges are filed regarding AI-Plagiarism. However, in a closed hearing, Marisol Clark submitted a written confession. She admitted to accidentally causing Elena Clark's death on April 4, 2022, and subsequently using AI to assume her sister's identity. The confession has been sealed. Marisol Clark awaits a separate trial for involuntary manslaughter and fraud.</p></div> <div class="star-rating svelte-1uha8ag">★★★</div> <div class="thoughtful-comment svelte-1uha8ag"><p class="svelte-1uha8ag">"You weren't sure. That doubt was the truth. You let the confession speak."</p></div>`);
			} else $$renderer.push("<!--[-1-->");
			$$renderer.push(`<!--]--></div> <button class="restart-btn svelte-1uha8ag">RESTART INVESTIGATION</button></div>`);
		} else if (currentView === "research") {
			$$renderer.push("<!--[3-->");
			$$renderer.push(`<div class="research-page svelte-1uha8ag"><h2 class="svelte-1uha8ag">Research Notes</h2> <div class="citations svelte-1uha8ag"><div class="citation svelte-1uha8ag">Case 1: Vance, E. (2025). "Confession", Chapter 1. Stylometric analysis report #2025-042.</div> <div class="citation svelte-1uha8ag">Case 2: Clark, E. (2022, March 31). "Weekend Plans". Elena Clark Official Blog. [Archived]</div> <div class="citation svelte-1uha8ag">Case 3: Clark, E. (2022, April 4). iMessage chat log with Mother. iCloud backup #C4-0902.</div> <div class="citation svelte-1uha8ag">Case 4: Clark, E. (2022, April 4). iMessage chat log, 21:17. Flagged as AI-generated by Linguistic Fingerprint Tool.</div> <div class="citation svelte-1uha8ag">Case 5: Rooney, D. (2022, April 5). Facebook post. Metadata &amp; DM recovered from marina Wi-Fi logs.</div> <div class="citation svelte-1uha8ag">Case 6: Clark, E. (2022, April 5). Email "Regrettable absence". Sent via ProtonMail, source IP traced to Clark residence.</div> <div class="citation svelte-1uha8ag">Case 7: Handwritten note "Daily Rhythm". Evidence tag #CLARK-07. Graphological comparison to Marisol Clark exemplar.</div> <div class="citation svelte-1uha8ag">Case 8: Vance, E. (2025). "Confession", final chapter. Authorship attribution report (Marisol Clark, 94% match).</div></div> <button class="back-btn svelte-1uha8ag">Back</button></div>`);
		} else $$renderer.push("<!--[-1-->");
		$$renderer.push(`<!--]--></div>`);
	});
}
//#endregion
export { _page as default };
