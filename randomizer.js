var randomizer = {
	onRandomize: function() {
		if (ui.seedInput == null || ui.seedInput.value === null || ui.seedInput.value === "") {
			alert("No seed was specified.");
			return;
		}

		if (rom.file === null) {
			alert("No ROM file was seleted.");
			return;
		}

		var isShuffleLevelsChecked = ui.shuffleLevelsCheck.checked;
		var isShuffleBonusChecked = ui.shuffleBonusCheck.checked;
		var isShuffleSfxChecked = ui.shuffleSfxCheck.checked;
		var isShuffleMusicChecked = ui.shuffleMusicCheck.checked;
		var isShufflePaletteColorsChecked = ui.shufflePaletteColorsCheck.checked;
		var isShufflePalettesChecked = ui.shufflePalettesCheck.checked;
		var isShufflePalettePointersChecked = ui.shufflePalettePointersCheck.checked;

		if (!isShuffleLevelsChecked && 
			!isShuffleBonusChecked && 
			!isShuffleSfxChecked && 
			!isShuffleMusicChecked &&
			!isShufflePaletteColorsChecked &&
			!isShufflePalettesChecked &&
			!isShufflePalettePointersChecked) 
		{
			alert("Nothing to randomize.");
			return;
		}

		Math.seedrandom(ui.seedInput.value);

		var ROM = rom.file.slice(0);
		
		if (isShuffleLevelsChecked) {
			randomizer.shuffleLevels(ROM);
		}

		if (isShuffleBonusChecked) {
			randomizer.shuffleBonuses(ROM);
		}

		if (isShuffleSfxChecked) {
			randomizer.shuffleSfx(ROM);
		}

		if (isShuffleMusicChecked) {
			randomizer.shuffleMusic(ROM);
		}

		if (isShufflePaletteColorsChecked) {
			randomizer.shufflePaletteColors(ROM);
		}

		if (isShufflePalettesChecked) {
			randomizer.shufflePalettes(ROM);
		}

		if (isShufflePalettePointersChecked) {
			randomizer.shufflePalettePointers(ROM);
		}

		downloadBlob(
			ROM, 
			ui.selectedFileNameOutput + "-" + ui.seedInput.value + ui.selectedFileExtOutput, 
			"application/octet-stream"
		);

		//console.log(ROM);
	},

	shuffleLevels: function(ROM) {
		var romData = ROM.slice(0);

		var levelPointerPool = rom.levelHeaderPointers.slice(0);
		var levelPointers = rom.levelHeaderPointers;

		for (var i = 0; i < levelPointers.length; i++) {
			var poolIndex = getRandomInt(levelPointerPool.length);

			ROM[levelPointers[i]] = romData[levelPointerPool[poolIndex]];
			ROM[levelPointers[i]+1] = romData[levelPointerPool[poolIndex]+1];

			var first = levelPointerPool.slice(0, poolIndex);
			var second = levelPointerPool.slice(poolIndex+1);
			levelPointerPool = first.concat(second);
		}
	},

	shuffleBonuses: function(ROM) {
		var romData = ROM.slice(0);

		var bonusPointerPool = rom.bonusHeaderPointers.slice(0);
		var bonusPointers = rom.bonusHeaderPointers;

		for (var i = 0; i < bonusPointers.length; i++) {
			var poolIndex = getRandomInt(bonusPointerPool.length);

			ROM[bonusPointers[i]] = romData[bonusPointerPool[poolIndex]];
			ROM[bonusPointers[i]+1] = romData[bonusPointerPool[poolIndex]+1];

			var first = bonusPointerPool.slice(0, poolIndex);
			var second = bonusPointerPool.slice(poolIndex+1);
			bonusPointerPool = first.concat(second);
		}
	},

	shuffleSfx: function(ROM) {
		var romData = ROM.slice(0);

		var sfxPointerPool = rom.sfxPointers.slice(0);
		var sfxPointers = rom.sfxPointers;

		for (var i = 0; i < sfxPointers.length; i++) {
			var poolIndex = getRandomInt(sfxPointerPool.length);

			ROM[sfxPointers[i]] = romData[sfxPointerPool[poolIndex]];
			ROM[sfxPointers[i]+1] = romData[sfxPointerPool[poolIndex]+1];

			var first = sfxPointerPool.slice(0, poolIndex);
			var second = sfxPointerPool.slice(poolIndex+1);
			sfxPointerPool = first.concat(second);
		}
	},

	shuffleMusic: function(ROM) {
		var romData = ROM.slice(0);

		var musicPointerPool = rom.musicPointers.slice(0);
		var musicPointers = rom.musicPointers;

		for (var i = 0; i < musicPointers.length; i++) {
			var poolIndex = getRandomInt(musicPointerPool.length);

			ROM[musicPointers[i]] = romData[musicPointerPool[poolIndex]];
			ROM[musicPointers[i]+1] = romData[musicPointerPool[poolIndex]+1];

			var first = musicPointerPool.slice(0, poolIndex);
			var second = musicPointerPool.slice(poolIndex+1);
			musicPointerPool = first.concat(second);
		}

		var musicDataPointer = rom.musicDataPointers;
		var musicDataPointers = [];

		// assuming first 14 pointers are for background music (since there are only 14 songs) 
		// shuffling all 21 pointers causes graphics bugs
		for (var i = 0; i < 14; i++) {
			var offset = musicDataPointer+(i*2);
			musicDataPointers.push([romData[offset], romData[offset+1]]);
		}
		var musicDataPointersPool = musicDataPointers.slice(0);

		for (var i = 0; i < musicDataPointers.length; i++) {
			var offset = musicDataPointer+(i*2);
			var poolIndex = getRandomInt(musicDataPointersPool.length);

			ROM[offset] = musicDataPointersPool[poolIndex][0];
			ROM[offset+1] = musicDataPointersPool[poolIndex][1];

			var first = musicDataPointersPool.slice(0, poolIndex);
			var second = musicDataPointersPool.slice(poolIndex+1);
			musicDataPointersPool = first.concat(second);
		}
	},

	shufflePaletteColors: function(ROM) {
		var romData = ROM.slice(0);
		var palettePointers = rom.palettePointers;

		for (var i = 0; i < palettePointers.length; i++) {
			var paletteAddr = palettePointers[i][0];
			var paletteLen = palettePointers[i][1];

			var colorPool = [];
			for (var j = 0; j < paletteLen; j++) {
				var color = romData[paletteAddr+j];
				//console.log("color: " + color);
				colorPool.push(color);
			}

			for (var j = 0; j < paletteLen; j++) {
				var poolIndex = getRandomInt(colorPool.length);

				ROM[paletteAddr+j] = colorPool[poolIndex];

				var first = colorPool.slice(0, poolIndex);
				var second = colorPool.slice(poolIndex+1);
				colorPool = first.concat(second);
			}
		}
	},

	shufflePalettes: function(ROM) {
		var romData = ROM.slice(0);

		var palette16Pointers = rom.palette16Pointers;
		var palette16PointersPool = palette16Pointers.slice(0);

		for (var i = 0; i < palette16Pointers.length; i++) {
			var poolIndex = getRandomInt(palette16PointersPool.length);

			for (var j = 0; j < 16; j++) {
				ROM[palette16Pointers[i+j]] = romData[palette16PointersPool[poolIndex]+j];
			}

			var first = palette16PointersPool.slice(0, poolIndex);
			var second = palette16PointersPool.slice(poolIndex+1);
			palette16PointersPool = first.concat(second);
		}

		var palette32Pointers = rom.palette32Pointers;
		var palette32PointersPool = palette32Pointers.slice(0);
		for (var i = 0; i < palette32Pointers.length; i++) {
			var poolIndex = getRandomInt(palette32PointersPool.length);

			for (var j = 0; j < 32; j++) {
				ROM[palette32Pointers[i+j]] = romData[palette32PointersPool[poolIndex]+j];
			}

			var first = palette32PointersPool.slice(0, poolIndex);
			var second = palette32PointersPool.slice(poolIndex+1);
			palette32PointersPool = first.concat(second);
		}

		var palette48Pointers = rom.palette48Pointers;
		var palette48PointersPool = palette48Pointers.slice(0);
		for (var i = 0; i < palette48Pointers.length; i++) {
			var poolIndex = getRandomInt(palette48PointersPool.length);

			for (var j = 0; j < 48; j++) {
				ROM[palette48Pointers[i+j]] = romData[palette48PointersPool[poolIndex]+j];
			}

			var first = palette48PointersPool.slice(0, poolIndex);
			var second = palette48PointersPool.slice(poolIndex+1);
			palette48PointersPool = first.concat(second);
		}

		var palette64Pointers = rom.palette64Pointers;
		var palette64PointersPool = palette64Pointers.slice(0);
		for (var i = 0; i < palette64Pointers.length; i++) {
			var poolIndex = getRandomInt(palette64PointersPool.length);

			for (var j = 0; j < 64; j++) {
				ROM[palette64Pointers[i+j]] = romData[palette64PointersPool[poolIndex]+j];
			}

			var first = palette64PointersPool.slice(0, poolIndex);
			var second = palette64PointersPool.slice(poolIndex+1);
			palette64PointersPool = first.concat(second);
		}
	},

	shufflePalettePointers: function(ROM) {
		var romData = ROM.slice(0);
		var levelPalettePointer = rom.levelPalettesPointer;
		var palettePointers = [];

		for (var i = 0; i < 14; i++) {
			var offset = levelPalettePointer+(i*2);
			palettePointers.push([romData[offset], romData[offset+1]]);
		}
		var palettePointersPool = palettePointers.slice(0);

		for (var i = 0; i < palettePointers.length; i++) {
			var offset = levelPalettePointer+(i*2);
			var poolIndex = getRandomInt(palettePointersPool.length);

			ROM[offset] = palettePointersPool[poolIndex][0];
			ROM[offset+1] = palettePointersPool[poolIndex][1];

			var first = palettePointersPool.slice(0, poolIndex);
			var second = palettePointersPool.slice(poolIndex+1);
			palettePointersPool = first.concat(second);
		}
	},
}