# Practice Tests Naming Convention Guide

## Overview
This guide establishes consistent naming conventions for all practice tests in the Practice Tests Hub.

## Test Categories & Codes

### Situational Judgment Tests (SJ)
**Prefix:** `SJ-`
**Directory:** `situational-judgment/`

1. **SJ-01: Workplace Fundamentals** (`sj-fundamentals.html`)
   - 15 Questions, 25 Minutes, Beginner
   - Essential workplace scenarios covering communication, teamwork, and problem-solving

2. **SJ-02: Leadership Scenarios** (`sj-leadership.html`)
   - 12 Questions, 20 Minutes, Intermediate
   - Advanced leadership challenges including conflict resolution and team management

3. **SJ-03: Ethics & Compliance** (`sj-ethics.html`)
   - 10 Questions, 15 Minutes, Advanced
   - Complex ethical dilemmas and compliance scenarios for senior roles

### Verbal Reasoning Tests (VR)
**Prefix:** `VR-`
**Directory:** `verbal-reasoning/`

1. **VR-01: Reading Comprehension** (`vr-comprehension.html`)
   - 20 Questions, 30 Minutes, Beginner
   - Practice with passages on various topics testing understanding and inference

2. **VR-02: Critical Analysis** (`vr-critical-analysis.html`)
   - 15 Questions, 25 Minutes, Intermediate
   - Advanced text analysis focusing on arguments, assumptions, and logical reasoning

3. **VR-03: Advanced Inference** (`vr-advanced-inference.html`)
   - 12 Questions, 20 Minutes, Advanced
   - Complex inference questions with challenging academic and professional texts

### Diagrammatic Reasoning Tests (DR)
**Prefix:** `DR-`
**Directory:** `diagrammatic-reasoning/`

1. **DR-01: Pattern Recognition** (`dr-pattern-recognition.html`)
   - 18 Questions, 25 Minutes, Beginner
   - Identify visual patterns and sequences in geometric shapes and symbols

2. **DR-02: Logical Sequences** (`dr-logical-sequences.html`)
   - 15 Questions, 22 Minutes, Intermediate
   - Complex sequential reasoning with multiple transformation rules

3. **DR-03: Abstract Reasoning** (`dr-abstract-reasoning.html`)
   - 12 Questions, 18 Minutes, Advanced
   - Advanced abstract reasoning with complex multi-layered transformations

### Numerical Reasoning Tests (NR)
**Prefix:** `NR-`
**Directory:** `numerical-reasoning/`

1. **NR-01: Basic Calculations** (`nr-basic-calculations.html`)
   - 20 Questions, 30 Minutes, Beginner
   - Fundamental arithmetic and percentage calculations with charts and tables

2. **NR-02: Data Analysis** (`nr-data-analysis.html`)
   - 15 Questions, 25 Minutes, Intermediate
   - Interpret complex graphs, trends, and statistical information

3. **NR-03: Financial Analysis** (`nr-financial-analysis.html`)
   - 12 Questions, 20 Minutes, Advanced
   - Advanced financial calculations including ratios, forecasting, and modeling

### Logical Reasoning Tests (LR)
**Prefix:** `LR-`
**Directory:** `logical-reasoning/`

1. **LR-01: Deductive Reasoning** (`lr-deductive-reasoning.html`)
   - 16 Questions, 25 Minutes, Beginner
   - Practice drawing logical conclusions from given premises and statements

2. **LR-02: Inductive Reasoning** (`lr-inductive-reasoning.html`)
   - 14 Questions, 22 Minutes, Intermediate
   - Identify patterns and make generalizations from specific observations

3. **LR-03: Conditional Reasoning** (`lr-conditional-reasoning.html`)
   - 10 Questions, 18 Minutes, Advanced
   - Master complex if-then scenarios and logical rule applications

## Naming Rules

### File Names
- Format: `[category-prefix]-[descriptive-name].html`
- Use lowercase with hyphens for separators
- Be descriptive but concise
- Examples: `sj-fundamentals.html`, `vr-comprehension.html`

### Test Titles
- Format: `[PREFIX]-[NN]: [Descriptive Title]`
- Use two-digit numbering (01, 02, 03...)
- Titles should be clear and professional
- Examples: "SJ-01: Workplace Fundamentals", "VR-02: Critical Analysis"

### Page Titles (HTML `<title>`)
- Format: `[Test Title] | Practice Tests Hub`
- Examples: "SJ-01: Workplace Fundamentals | Practice Tests Hub"

### Descriptions
- One clear sentence describing the test focus
- Should match the test content and difficulty level
- Be specific about what skills are tested

### Difficulty Levels
- **Beginner**: Entry-level, foundational concepts
- **Intermediate**: Moderate complexity, requires some experience
- **Advanced**: High complexity, expert-level challenges

### Test Metadata Format
- Questions: Always show number (e.g., "15 Questions")
- Time: Always show in minutes (e.g., "25 Minutes")
- Difficulty: Use consistent difficulty badges

## Copy Style Guide

### Tone & Voice
- Professional but approachable
- Action-oriented language ("Master", "Practice", "Develop")
- Clear and concise descriptions
- Consistent terminology across all tests

### Common Phrases
- "Master your skills with..."
- "Practice with..."
- "Develop your..."
- "Essential [topic] covering..."
- "Advanced [topic] focusing on..."
- "Complex [topic] with..."

### Consistency Requirements
- All category names should end with "Tests" (plural)
- All test descriptions should be complete sentences
- Use consistent formatting for metadata
- Maintain the same structure across all HTML files

## Implementation Checklist

### For Each New Test:
- [ ] Follow the naming convention for files and titles
- [ ] Include proper metadata (questions, time, difficulty)
- [ ] Add consistent HTML structure
- [ ] Include proper page title with "| Practice Tests Hub"
- [ ] Add test description that matches the category description
- [ ] Ensure difficulty level is appropriate and consistent
- [ ] Include all required CSS classes and styling
- [ ] Test links work correctly from main index

### For Updates:
- [ ] Verify all existing tests follow the convention
- [ ] Update any inconsistent naming or descriptions
- [ ] Ensure all metadata is accurate
- [ ] Check that difficulty progression makes sense within categories 