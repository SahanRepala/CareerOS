#!/usr/bin/env python3
"""
scripts/generate-agents.py

One-time (re-runnable) scaffolder for /agents/*. Keeping this script in the
repo means adding agent #17 is "add a manifest entry, run the script" instead
of hand-copying a folder and forgetting to update one file. Safe to re-run:
it only ever regenerates the placeholder files, never hand-written logic
(once an agent graduates from createPlaceholderAgent, remove its entry here).
"""
import os

AGENTS = [
    dict(id="resume-parser", title="Resume Parser", desc="Turns an uploaded resume file/text into a structured ParsedResume.",
         input="{ rawText: string; sourceFileName: string | null }", output="ParsedResume", output_import="ParsedResume",
         deps=[]),
    dict(id="jd-parser", title="JD Parser", desc="Turns a pasted/uploaded job description into a structured ParsedJobDescription.",
         input="{ rawText: string; sourceUrl: string | null }", output="ParsedJobDescription", output_import="ParsedJobDescription",
         deps=[]),
    dict(id="ats-agent", title="ATS Agent", desc="Scores a ParsedResume against a ParsedJobDescription the way an ATS keyword scan would.",
         input="{ resume: ParsedResume; jobDescription: ParsedJobDescription }", output="AtsReport", output_import="AtsReport",
         deps=["resume-parser", "jd-parser"]),
    dict(id="resume-rewrite-agent", title="Resume Rewrite Agent", desc="Proposes a rewritten ParsedResume optimized for a target job description.",
         input="{ resume: ParsedResume; jobDescription: ParsedJobDescription }", output="ParsedResume", output_import="ParsedResume",
         deps=["resume-parser", "jd-parser"]),
    dict(id="bullet-improvement-agent", title="Bullet Improvement Agent", desc="Rewrites individual resume bullets for clarity and impact.",
         input="{ bullets: string[]; jobDescription: ParsedJobDescription | null }", output="{ original: string; improved: string; rationale: string }[]",
         output_import=None, deps=["resume-parser"]),
    dict(id="recruiter-review-agent", title="Recruiter Review Agent", desc="Simulates a recruiter's first-pass ('six second scan') read of a resume.",
         input="{ resume: ParsedResume }", output="RecruiterFeedbackReport", output_import="RecruiterFeedbackReport",
         deps=["resume-parser"]),
    dict(id="skill-gap-agent", title="Skill Gap Agent", desc="Diffs a candidate's current skills against a target role to find gaps.",
         input="{ candidate: CandidateProfile; targetRole: string }", output="SkillGapItem[]", output_import="SkillGapItem",
         deps=["resume-parser"]),
    dict(id="cover-letter-agent", title="Cover Letter Agent", desc="Drafts a cover letter grounded in the resume and job description.",
         input="{ resume: ParsedResume; jobDescription: ParsedJobDescription }", output="CoverLetter", output_import="CoverLetter",
         deps=["resume-parser", "jd-parser"]),
    dict(id="interview-agent", title="Interview Agent", desc="Generates and grades interview questions personalized to the candidate.",
         input="{ context: InterviewContext }", output="InterviewPack", output_import="InterviewPack",
         deps=["resume-parser", "jd-parser"], note="A non-agent heuristic version of this already exists at lib/ai/interview-questions.ts and lib/ai/interview-feedback.ts. This placeholder defines where it becomes an Agent-contract-compliant module; it does not replace the existing route yet."),
    dict(id="github-review-agent", title="GitHub Review Agent", desc="Produces qualitative engineering-maturity insights for a repository.",
         input="{ repoSignals: RepoSignals; techStack: TechStackItem[] }", output="AIInsights", output_import="AIInsights",
         deps=[], note="A non-agent heuristic version of this already exists at lib/ai/github-insights.ts and lib/ai/heuristic-insights.ts, called from app/api/github-intelligence. This placeholder defines where it becomes an Agent-contract-compliant module; it does not replace the existing route yet."),
    dict(id="portfolio-agent", title="Portfolio Agent", desc="Assesses a candidate's portfolio site/projects for clarity and presentation.",
         input="{ portfolioUrl: string }", output="PortfolioReport", output_import="PortfolioReport",
         deps=[]),
    dict(id="linkedin-agent", title="LinkedIn Agent", desc="Reviews a LinkedIn profile for consistency with the resume and role targets.",
         input="{ profileText: string; resume: ParsedResume }", output="{ score: number; suggestions: string[] }",
         output_import=None, deps=["resume-parser"]),
    dict(id="career-strategy-agent", title="Career Strategy Agent", desc="Builds a milestone roadmap toward a candidate's target role.",
         input="{ candidate: CandidateProfile; targetRole: string }", output="CareerReport", output_import="CareerReport",
         deps=["resume-parser", "skill-gap-agent"]),
    dict(id="salary-agent", title="Salary Agent", desc="Benchmarks expected compensation for a role, level, and location.",
         input="{ targetRole: string; seniority: string | null; location: string | null }", output="{ min: number; max: number; currency: string }",
         output_import=None, deps=[]),
    dict(id="quality-agent", title="Quality Agent", desc="Runs the /evaluators suite against another agent's output before it reaches the report builder.",
         input="{ agentId: string; output: unknown }", output="{ passed: boolean; evaluatorResults: Record<string, number> }",
         output_import=None, deps=["*"]),
    dict(id="report-agent", title="Report Agent", desc="Thin agent-contract wrapper around report-builders/ for orchestrator symmetry.",
         input="{ sections: Record<string, unknown> }", output="FinalReport", output_import="FinalReport",
         deps=["quality-agent"]),
]

ROOT = os.path.join(os.path.dirname(__file__), "..", "agents")

TYPES_TMPL = '''/**
 * agents/{id}/types.ts
 *
 * Input/output shapes for the {title}. Domain fields are imported from
 * /contracts rather than redeclared — this file only adds the envelope
 * that's specific to *this* agent's call signature.
 */
{imports}

export interface {pascal}Input {input_type_body}

export type {pascal}Output = {output_type};
'''

README_TMPL = '''# {title}

**Status:** architecture placeholder — no AI logic implemented.

## Responsibility

{desc}

## Contract

Implements `Agent<{pascal}Input, {pascal}Output>` from `/contracts/agent.contract.ts`.
See `types.ts` for the concrete input/output shapes.

## Upstream dependencies

{deps_line}

## Wiring this up for real

1. Replace the `createPlaceholderAgent(...)` call in `index.ts` with a real
   `Agent<{pascal}Input, {pascal}Output>` implementation (a hand-written object or class
   is fine — the contract doesn't care).
2. Add prompt content to `/prompts/{id}.md`.
3. Add provider/model routing for this agent in `/config/model-routing.config.ts`.
4. Add this agent's node to the relevant workflow(s) in `/workflows`.
5. Flip its flag on in `/config/feature-flags.ts`.

{note_block}'''

INDEX_TMPL = '''/**
 * agents/{id}/index.ts
 *
 * Placeholder implementation. See README.md for how this graduates into a
 * real agent.
 */
import {{ createPlaceholderAgent }} from '../_shared/placeholder-agent';
import type {{ {pascal}Input, {pascal}Output }} from './types';

const {camel}Agent = createPlaceholderAgent<{pascal}Input, {pascal}Output>({{
  id: '{id}',
  version: '0.1.0-placeholder',
}});

export default {camel}Agent;
export type {{ {pascal}Input, {pascal}Output }} from './types';
'''

def to_pascal(s):
    return ''.join(p.capitalize() for p in s.split('-'))

def to_camel(s):
    pas = to_pascal(s)
    return pas[0].lower() + pas[1:]

CONTRACT_TYPE_MAP = {
    "ParsedResume": "resume.contract",
    "ParsedJobDescription": "job-description.contract",
    "CandidateProfile": "resume.contract",
    "AtsReport": "ats-report.contract",
    "RecruiterFeedbackReport": "ats-report.contract",
    "SkillGapItem": "career-report.contract",
    "CoverLetter": "cover-letter.contract",
    "InterviewContext": "interview.contract",
    "InterviewPack": "interview.contract",
    "RepoSignals": "github-report.contract",
    "TechStackItem": "github-report.contract",
    "AIInsights": "github-report.contract",
    "PortfolioReport": "portfolio-report.contract",
    "CareerReport": "career-report.contract",
    "FinalReport": "final-report.contract",
}

def needed_contract_types(agent):
    text = agent["input"] + " " + agent["output"]
    found = []
    for name in CONTRACT_TYPE_MAP:
        if name in text and name not in found:
            found.append(name)
    return found

for agent in AGENTS:
    aid = agent["id"]
    pascal = to_pascal(aid)
    camel = to_camel(aid)
    folder = os.path.join(ROOT, aid)
    os.makedirs(folder, exist_ok=True)

    types_needed = needed_contract_types(agent)
    by_module = {}
    for t in types_needed:
        by_module.setdefault(CONTRACT_TYPE_MAP[t], []).append(t)
    imports = "\n".join(
        f"import type {{ {', '.join(sorted(names))} }} from '../../contracts/domain/{mod}';"
        for mod, names in sorted(by_module.items())
    )

    input_body = " {\n  " + agent["input"].strip("{} ").strip() + "\n}" if agent["input"].startswith("{") else f" = {agent['input']};"
    # Normalize: always render as an interface body when input starts with '{'
    if agent["input"].startswith("{"):
        inner = agent["input"].strip()[1:-1].strip()
        fields = [f.strip() for f in inner.split(";") if f.strip()]
        input_type_body = " {\n" + "\n".join(f"  {f};" for f in fields) + "\n}"
    else:
        input_type_body = f" = {agent['input']};"

    types_content = TYPES_TMPL.format(
        id=aid, title=agent["title"], pascal=pascal,
        imports=imports if imports else "// No shared contract types needed for this agent's input/output yet.",
        input_type_body=input_type_body,
        output_type=agent["output"],
    )
    with open(os.path.join(folder, "types.ts"), "w") as f:
        f.write(types_content)

    deps = agent["deps"]
    if deps == ["*"]:
        deps_line = "Runs after every other agent in a workflow — see `/orchestrator`."
    elif deps:
        deps_line = "\n".join(f"- `{d}`" for d in deps)
    else:
        deps_line = "None. This agent can run as soon as raw input is available."

    note_block = ""
    if agent.get("note"):
        note_block = "## Note\n\n" + agent["note"] + "\n"

    readme_content = README_TMPL.format(
        title=agent["title"], desc=agent["desc"], pascal=pascal, id=aid,
        deps_line=deps_line, note_block=note_block,
    )
    with open(os.path.join(folder, "README.md"), "w") as f:
        f.write(readme_content)

    index_content = INDEX_TMPL.format(id=aid, pascal=pascal, camel=camel)
    with open(os.path.join(folder, "index.ts"), "w") as f:
        f.write(index_content)

    print(f"scaffolded agents/{aid}")

print(f"\n{len(AGENTS)} agents scaffolded.")
