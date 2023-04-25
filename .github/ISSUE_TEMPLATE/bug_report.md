---
name: Bug report
description: "File a bug/issue"
title: '[Bug]: '
labels: [bug]
body:
  - type: markdown
    attributes:
      value: Thank you for taking the time to write this report!
  - type: checkboxes
    id: Obsidian-Versions
    attributes:
      label: Obsidian Version
      description: >-
        Please check off to confirm the following. If you are not on these
        versions, please upgrade first and try again.
      options:
        - label: Your Obsidian Installer Version is at least 1.1.9
          required: true
        - label: Your Obsidian Application Version is at Least 1.1.5
          required: true
  - type: textarea
    id: description
    attributes:
      label: Describe the Bug
      description: A clear and concise description of what the bug is
      placeholder: >-
        When I apply my custom class to a single wiki link, the color applies,
        but the text-shadow does not apply.
    validations:
      required: true
  - type: textarea
    id: css-or-scss
    attributes:
      label: CSS
      description: >-
        Please paste the CSS (Or SCSS/SASS if applicable) you are trying to use
        below.
      placeholder: >-
        ```css .font-test {     font-family: fantasy;     font-size: 1.5em;
        font-weight: 700;     font-style: italic;     text-decoration:
        underline;     text-transform: uppercase;     text-align: center;
        color: #ff0000;     background-color: #00ff00;     line-height: 1.5;
        letter-spacing: 0.5em;     word-spacing: 1em;     text-indent: 1em;
        text-shadow: 0.1em 0.1em 0.1em #000000;     white-space: pre-wrap;
        border: 1px solid #000000;     border-radius: 1em;     padding: 1em;
        margin: 1em;     width: 50%;     height: 50%;     overflow: auto;
        box-shadow: 0.1em 0.1em 0.1em #000000;     opacity: 0.5; }
    validations:
      required: true
  - type: textarea
    id: markdown-input
    attributes:
      label: Markdown Input
      description: What is the markdown input you are attempting to add a class to?
      placeholder: '[[Link-me!]] { .link-me-my-friend}'
    validations:
      required: true
  - type: textarea
    id: screenshot-video
    attributes:
      label: Screenshot, Gif, or Video
      description: Please Attach a Screenshot, Gif, or Video
      placeholder: This helps us understand visually what is happening. :)
    validations:
      required: true
---
