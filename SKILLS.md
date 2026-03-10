---
name: data-tool-builder
description: Guidelines for building simple data cleaning and fuzzy mapping tools for data journalism and research.
---
Skills: Building Simple Data Tools

User Profile
The user is a non-programmer building small data tools for:
    Data journalism
    Research
    Dataset cleaning
    Data standardization

Tools should be:
    Simple
    Reliable
    Easy to run locally
    Designed for non-technical users
    Avoid complex frameworks unless absolutely necessary.

Preferred Tool Stack
Backend / Logic
    Python
Interface
    Streamlit (preferred)
Simple web UI
Data Handling
    pandas
Fuzzy Matching
    rapidfuzz
File Formats
    CSV
    Excel (.xlsx)

Default Tool Design Pattern
The tool should follow this structure.
    Step 1 — Upload Inputs
Allow users to upload:
    Dataset file
    Reference dictionary (if required)

        Example dataset:
            district_name
            state
            airline

        Example dictionary:
            standard_name
    Step 2 — Column Selection
    Allow the user to select:
    Dataset columns to clean
    Dictionary columns containing standardized values
    Use dropdown selectors.
    Step 3 — Processing
    Typical operations include:
        Fuzzy matching
        Standardization
        Deduplication
        Mapping
        Validation
    Processing should be fast and scalable for large datasets.
    Step 4 — Preview Results
        Display a preview table showing:
            Original Value	Matched Value	Score
            U.P	Uttar Pradesh	95
            Uttar prades	Uttar Pradesh	91
            Pradesh, Uttar	Uttar Pradesh	88
        This allows users to review mapping before export.
    Step 5 — Manual Correction
        Allow users to:
            Edit incorrect matches
            Override suggested values
            Manual override is important to ensure accurate final standardization.
    Step 6 — Export
        Allow download of cleaned dataset.
        Preferred formats:
        CSV
        Excel

Fuzzy Matching Strategy
    Do not rely on a single similarity method.
    Apply multiple string matching techniques and select the highest confidence match.
    Preferred similarity approaches:
        String Similarity (ratio)
        Partial String Similarity (partial_ratio)
        Token Sort Similarity (token_sort_ratio)
        Token Set Similarity (token_set_ratio)
        Weighted Similarity (WRatio)
        Token-based similarity
        Out-of-order word matching
    These methods help handle common messy data issues:
        Abbreviations
        Missing words
        Extra words
        Reversed word order
        Punctuation differences
        Spacing variations

    Example messy values:
        UP
        U.P
        Uttar prades
        Pradesh, Uttar
        State of Uttar Pradesh

    Standard value:
        Uttar Pradesh

    The tool should compute multiple similarity scores and choose the best match.

    Preferred RapidFuzz functions:
        fuzz.ratio
        fuzz.partial_ratio
        fuzz.token_sort_ratio
        fuzz.token_set_ratio
        fuzz.WRatio

    Default similarity threshold:
        80–90

    If the score falls below the threshold:
        Flag the record as:
            Review Required

    Data Standardization Patterns
        Dictionary-Based Mapping
        Map messy values to standardized values using a reference dictionary.

    Example:
        Messy values:
            UP
            U.P
            Uttar prades
            Pradesh, Uttar
    Standard value:
        Uttar Pradesh
    Use fuzzy matching to map these automatically.

Output Requirements
    The cleaned dataset should include:
        Original column
        Standardized column
        Match confidence score
        Low-confidence flag
    Example output:
        Original	Standardized	Score	Flag
        U.P	Uttar Pradesh	95	OK
        Uttar prades	Uttar Pradesh	84	Review

UI Guidelines
Tools should follow a clear step-based interface.
Display steps clearly:
    Upload dataset
    Upload dictionary
    Select column
    Run mapping
    Review results
    Download output

Interface should be:
Minimal
Clean
Easy for non-technical users
Focused on task completion
Avoid complex dashboards.

Error Handling
The tool should detect and warn about:
    Missing columns
    Empty files
    Unsupported file formats
    Missing dictionary values
    Very low match scores
    Instead of crashing, show clear messages such as:
    "Selected column not found in dataset."
    "Dictionary file appears to be empty."
    "Low-confidence matches detected."

Documentation Style
Every generated tool must include documentation.

Description
Explain what the tool does in 2–3 sentences.
    Example:
    "This tool standardizes messy text values using fuzzy matching and a reference dictionary."

How to Run
Example:
    pip install streamlit pandas rapidfuzz openpyxl
    streamlit run app.py

Required Files
Explain required inputs:
    Dataset file
    Dictionary file (if needed)
Example Input
    Provide sample dataset structure.
Example Output
    Show cleaned dataset format.
Code Generation Rules
When generating code:
    Keep code simple and readable
    Use one main file (app.py) unless necessary
    Write clear functions
    Add comments explaining key steps

Preferred project structure:

project-folder/
│
├── app.py
├── skills.md
├── requirements.txt
└── README.md

Avoid:
    Complex frameworks
    Unnecessary dependencies
    Over-engineering

Reusable Components
Prefer reusable modules for:
    File uploader
    Column selector
    Fuzzy matcher
    Mapping preview table
    Export button
Reusable components improve consistency across tools.

Debugging Rules
When errors occur:
Explain the problem clearly.
Show the corrected code.
Avoid technical jargon.
Example:
    Bad explanation:
    KeyError: dataframe index mismatch
    Better explanation:
    The selected column does not exist in the dataset. Please check the column name.

Future Enhancements
Possible improvements include:
    Batch dataset processing
    Auto-learning dictionary
    Interactive correction interface
    API integration
    Smart mapping suggestions
    Duplicate detection tools

