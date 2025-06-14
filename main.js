 /***********************************************
     * Global Variables and Game State
     ***********************************************/
    let tiles = [];            // Array containing all tile objects.
    let selectedTileId = null; // Id of the currently selected tile.
    let currentLevel = 1;      // Start at Level 1.
    const TILE_WIDTH = 80;
    const TILE_HEIGHT = 100;
    
    // Define a comprehensive set of Mahjong tile emojis (34 available).
    const tileEmojis = ["🀇","🀈","🀉","🀊","🀋","🀌","🀍","🀎","🀏",
                        "🀐","🀑","🀒","🀓","🀔","🀕","🀖","🀗","🀘",
                        "🀙","🀚","🀛","🀜","🀝","🀞","🀟","🀠","🀡"];
    
    /***********************************************
     * Generate Dynamic Positions for the Level
     * Level 1: Base layout with 36 positions (28 on layer 0 + 8 on layer 1)
     * Each level after 1 adds 4 extra positions (an extra layer with 4 tiles)
     ***********************************************/
    function generatePositions(level) {
      let pos = [];
      // Base layout: Level 1 - Layer 0 (7 columns x 4 rows = 28 positions)
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 7; col++) {
          pos.push({
            x: 50 + col * 100,
            y: 50 + row * 110,
            z: 0,
            width: TILE_WIDTH,
            height: TILE_HEIGHT
          });
        }
      }
      // Base layout: Level 1 - Layer 1 (2 rows x 4 columns = 8 positions)
      for (let row = 0; row < 2; row++) {
        for (let col = 0; col < 4; col++) {
          pos.push({
            x: 200 + col * 100,
            y: 150 + row * 110,
            z: 1,
            width: TILE_WIDTH,
            height: TILE_HEIGHT
          });
        }
      }
      // For each extra level beyond 1, add 4 positions (one extra layer per level).
      for (let extra = 0; extra < level - 1; extra++) {
        for (let col = 0; col < 4; col++) {
          pos.push({
            x: 150 + col * 90,
            y: 300 + extra * 110,
            z: 2 + extra,
            width: TILE_WIDTH,
            height: TILE_HEIGHT
          });
        }
      }
      return pos;
    }
    
    /***********************************************
     * Initialize the Game
     * Generates positions dynamically based on the current level,
     * creates tile pairs (each unique emoji appears twice),
     * and assigns each tile to a position.
     ***********************************************/
    function initGame() {
      tiles = [];
      selectedTileId = null;
      document.getElementById("message").textContent = "";
      
      // Generate positions based on the current level.
      const positions = generatePositions(currentLevel);
      const totalTiles = positions.length; // Must be even.
      const uniqueCount = totalTiles / 2;
      
      // Select the first 'uniqueCount' emojis from our set.
      // If uniqueCount is larger than available, wrap-around.
      let uniqueEmojis = [];
      for (let i = 0; i < uniqueCount; i++) {
        uniqueEmojis.push(tileEmojis[i % tileEmojis.length]);
      }
      
      // Create a tileTypes array where each unique emoji appears twice.
      let tileTypes = [];
      uniqueEmojis.forEach(emoji => {
        tileTypes.push(emoji);
        tileTypes.push(emoji);
      });
      // Shuffle the tileTypes array.
      shuffle(tileTypes);
      
      // Create a tile for each position.
      for (let i = 0; i < positions.length; i++) {
        let pos = positions[i];
        let tile = {
          id: i,
          type: tileTypes[i],
          x: pos.x,
          y: pos.y,
          z: pos.z,
          width: pos.width,
          height: pos.height,
          removed: false
        };
        tiles.push(tile);
      }
      renderTiles();
    }
    
    // Fisher–Yates Shuffle
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    
    /***********************************************
     * Rendering Functions
     * Render all tiles on the board based on their properties.
     ***********************************************/
    function renderTiles() {
      let board = document.getElementById("board-container");
      board.innerHTML = "";
      
      // Sort tiles by z-index so that higher-layer tiles are displayed on top.
      let sortedTiles = tiles.slice().sort((a, b) => a.z - b.z);
      
      sortedTiles.forEach(tile => {
        if (!tile.removed) {
          let tileDiv = document.createElement("div");
          tileDiv.className = "tile";
          if (tile.id === selectedTileId) {
            tileDiv.classList.add("selected");
          }
          tileDiv.textContent = tile.type;
          tileDiv.style.left = tile.x + "px";
          tileDiv.style.top = tile.y + "px";
          tileDiv.style.zIndex = tile.z;
          tileDiv.onclick = () => handleTileClick(tile.id);
          board.appendChild(tileDiv);
        }
      });
    }
    
    /***********************************************
     * Free Tile Detection
     * A tile is free if:
     * 1. No tile on a higher layer overlaps it.
     * 2. At least one of its left or right sides is unobstructed by any tile on the same layer.
     ***********************************************/
    function isTileFree(tile) {
      if (tile.removed) return false;
      
      // Condition 1: Check if any tile on a higher layer overlaps.
      for (let other of tiles) {
        if (!other.removed && other.z > tile.z) {
          if (isOverlap(tile, other)) {
            return false;
          }
        }
      }
      
      // Condition 2: Check for horizontal free sides on the same layer.
      let leftBlocked = false;
      let rightBlocked = false;
      for (let other of tiles) {
        if (!other.removed && other.z === tile.z && other.id !== tile.id) {
          if (isTouchingLeft(tile, other)) leftBlocked = true;
          if (isTouchingRight(tile, other)) rightBlocked = true;
        }
      }
      return (!leftBlocked || !rightBlocked);
    }
    
    // Check for bounding box overlap of two tiles.
    function isOverlap(tile1, tile2) {
      return (
        tile1.x < tile2.x + tile2.width &&
        tile1.x + tile1.width > tile2.x &&
        tile1.y < tile2.y + tile2.height &&
        tile1.y + tile1.height > tile2.y
      );
    }
    
    // Check if 'other' tile touches the left side of 'tile'.
    function isTouchingLeft(tile, other) {
      if (other.x + other.width >= tile.x - 10 && other.x + other.width <= tile.x + 10) {
        return verticalOverlap(tile, other);
      }
      return false;
    }
    
    // Check if 'other' tile touches the right side of 'tile'.
    function isTouchingRight(tile, other) {
      if (other.x <= tile.x + tile.width + 10 && other.x >= tile.x + tile.width - 10) {
        return verticalOverlap(tile, other);
      }
      return false;
    }
    
    function verticalOverlap(tile, other) {
      return (tile.y < other.y + other.height && tile.y + tile.height > other.y);
    }
    
    /***********************************************
     * Tile Selection & Matching
     * Select a free tile by clicking it.  
     * If a second free tile with the same type is clicked, both are removed.
     ***********************************************/
    function handleTileClick(tileId) {
      let tile = tiles.find(t => t.id === tileId);
      if (!tile || tile.removed) return;
      
      if (!isTileFree(tile)) {
        document.getElementById("message").textContent = "Tile is not free.";
        return;
      }
      
      if (selectedTileId === null) {
        // First selection
        selectedTileId = tileId;
        document.getElementById("message").textContent = "Selected tile " + tile.type + ". Click on a matching free tile.";
      } else {
        let firstTile = tiles.find(t => t.id === selectedTileId);
        if (firstTile.id === tile.id) {
          // Deselect if the same tile is clicked.
          selectedTileId = null;
          document.getElementById("message").textContent = "";
        } else if (firstTile.type === tile.type) {
          // Tiles match: Remove both.
          firstTile.removed = true;
          tile.removed = true;
          document.getElementById("message").textContent = "Matched " + tile.type + " pair!";
          selectedTileId = null;
          renderTiles();
          checkWinCondition();
          return;
        } else {
          // Tiles do not match.
          document.getElementById("message").textContent = "Tiles do not match. Try again.";
          selectedTileId = null;
        }
      }
      renderTiles();
    }
    
    /***********************************************
     * Win Condition & Level Progression
     * If all tiles are removed, the level is cleared and a new level is generated.
     ***********************************************/
    function checkWinCondition() {
      let remaining = tiles.filter(t => !t.removed).length;
      if (remaining === 0) {
        document.getElementById("message").textContent = "Congratulations! You cleared level " + currentLevel + "!";
        // After a short delay, increase level and generate a new one.
        setTimeout(() => {
          currentLevel++;
          document.getElementById("message").textContent = "Level up! Starting level " + currentLevel + "...";
          initGame();
        }, 2000);
      }
    }
    
    /***********************************************
     * Event Handlers for UI Buttons and Help Modal
     ***********************************************/
    document.getElementById("newGameBtn").onclick = function() {
      currentLevel = 1;
      initGame();
    };
    document.getElementById("helpBtn").onclick = function() {
      document.getElementById("helpModal").style.display = "block";
    };
    document.getElementById("closeHelp").onclick = function() {
      document.getElementById("helpModal").style.display = "none";
    };
    window.onclick = function(e) {
      if (e.target === document.getElementById("helpModal")) {
        document.getElementById("helpModal").style.display = "none";
      }
    };
    
    /***********************************************
     * Initialize the Game
     ***********************************************/
    initGame();
