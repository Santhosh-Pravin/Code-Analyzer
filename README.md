# Code-Analyzer
AI Code Documentation Navigator is a web application that helps developers understand source code quickly. Users can upload code files or paste code, and the system analyzes the content using AI to generate explanations, summaries, and insights about the program structure and logic.
This tool is designed to make it easier to understand unfamiliar codebases, learn programming concepts, and improve documentation efficiency.

#Features

Upload or paste source code

Automatic code summarization

Function and class explanations

Chat interface to ask questions about the code

Structured output showing:

Purpose of the code

Key components

Execution flow

Basic handling of large files using chunking or context compression

Clean and simple web interface

#Technologies Used

Frontend

HTML, CSS, JavaScript (or React if used)

Backend

Python (FastAPI / Flask) or Node.js

AI Integration

Gemini Pro / Claude API for code understanding and explanation

Other Tools

File processing libraries

REST API communication

#How It Works

The user uploads or pastes source code.

The backend processes the code and splits it into manageable chunks if necessary.

The AI model analyzes the code and generates:

A summary

Explanations of functions and logic

The results are displayed in the web interface.

Users can ask follow-up questions using the chat feature.
