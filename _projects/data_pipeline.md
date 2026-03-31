---
layout: page
title: Automated Data Extraction Pipeline
description: Batch processing tool with compression, chunking, and multi-encoding support for high-volume financial spreadsheets.
img: assets/img/projects/data_pipeline.jpg
importance: 2
category: "Data Engineering"
---

## Overview

Processing thousands of financial spreadsheets daily requires robust automation that handles edge cases gracefully — files with different encodings, workbooks with VBA macros, and datasets that exceed memory limits. This pipeline automates the end-to-end extraction workflow with adaptive chunking, compression, and comprehensive error handling.

## Technical Approach

```mermaid
graph LR
    A[File<br/>Queue] --> B[Encoding<br/>Detection]
    B --> C[VBA/Macro<br/>Detection]
    C --> D[Adaptive<br/>Chunk Sizing]
    D --> E[Parallel<br/>Processing]
    E --> F[gzip<br/>Compression]
    F --> G[Output<br/>Dataset]
    G --> H[Validation<br/>Report]
```

**Multi-Encoding Detection**: Files are probed for encoding using a cascade of UTF-8, Latin-1, and CP1252 detection. The pipeline handles mixed encodings within a single workbook gracefully.

**VBA/Macro Detection**: Workbooks containing VBA macros are flagged and processed in a sandboxed mode that extracts data without executing macros. Macro presence is logged for security auditing.

**Adaptive Chunk Sizing**: Large files are split into chunks based on available memory and file characteristics. Chunk boundaries respect logical row groups (e.g., deal boundaries) to avoid splitting related records.

**Parallel Processing**: Independent chunks are processed concurrently, with results assembled in order after completion. Failed chunks are retried with smaller sizes before reporting errors.

**Compression & Output**: Processed data is compressed using gzip and base64-encoded for efficient storage and transmission. Output includes row counts and checksums for verification.

## Key Results

- Processes thousands of spreadsheets daily with <1% error rate
- Adaptive chunking handles files from kilobytes to gigabytes
- Multi-encoding support eliminates manual encoding fixes
- VBA detection provides security audit trail
- gzip compression reduces storage requirements by 60-80%

## Technologies Used

`Python` `openpyxl` `pandas` `gzip` `base64`
