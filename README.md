# Mahjong Solitaire – WEBGAMES
#### Author: Bocaletto Luca

[![Made with HTML5](https://img.shields.io/badge/Made%20with-HTML5-E34F26?logo=html5)](https://www.w3.org/html/)
[![Made with CSS3](https://img.shields.io/badge/Made%20with-CSS3-1572B6?logo=css3)](https://www.w3.org/Style/CSS/)
[![Made with JavaScript](https://img.shields.io/badge/Made%20with-JavaScript-F7DF1E?logo=javascript)](https://developer.mozilla.org/docs/Web/JavaScript)

[![Test Online](https://img.shields.io/badge/Test%20Online-Click%20Here-brightgreen?style=for-the-badge)](https://bocaletto-luca.github.io/Mahjong-Solitaire/)

## Overview

Mahjong Solitaire – is a modern, fully responsive single‑player web game that faithfully adapts classic Mahjong Solitaire for the web. The game uses Mahjong tile emoji (styled in a nearly black color with decorative card frames) and dynamically generates levels. With each level clearance, extra tiles and an additional layer are added to raise the challenge. The rules follow the traditional gameplay where only free tiles can be selected and matched, and players remove pairs until the board is cleared.

## Features

- **Responsive Design:** The game board is centered and scales to fill the available page on desktops, tablets, and smartphones.
- **Modern UI:** Uses a sleek layout with decorative tile borders, rounded corners, and subtle shadows for a professional look.
- **Dynamic Level Generator:** Starts at level 1 with 36 tiles (28 on the base layer and 8 on a top layer). When you clear a level, additional tiles are added by generating extra layers, increasing the challenge.
- **Free Tile Detection:** Only tiles that are “free” (i.e. not overlapped by a higher layer and with an open left or right side) can be selected.
- **Tile Matching & Removal:** Click on one free tile, then click on a matching free tile to remove both from the board.
- **Help Modal:** Provides complete instructions on how to play the game.
- **User Feedback:** A message area displays move feedback, errors (e.g. “Tile is not free” or “Tiles do not match”), and congratulatory messages when a level is completed.
- **Footer:** Displays “© 2025 Bocaletto Luca” and remains pinned to the bottom of the page.

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/bocaletto-luca/Mahjong-Solitaire.git
2. Start Sever Web Example Apache2 and open index.html in web Browser

## Usage
Gameplay: The goal is to remove all matching pairs of tiles.

A tile is considered free if it is not overlapped by any tile on a higher layer and if at least one horizontal side (left or right) is unobstructed.

Click a free tile to select it, then click on another free tile with the same Mahjong emoji to remove the matching pair.

Dynamic Levels: When you clear all tiles on the board, you’ll receive a congratulatory message, and the game automatically advances to the next level. Each new level adds extra tiles for a greater challenge.

## Help: Click the Help button to view the instructions and rules.

## Contributing
Contributions, bug reports, and feature suggestions are welcome! Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss your proposed improvements.

#### Enjoy Gamw - By Bocaletto Luca

#### License: GPLv3
