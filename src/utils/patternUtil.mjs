const PATTERNS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];

const findWinner = arrOfCells => {
	console.log("We accepted", arrOfCells);
	for (const pattern of PATTERNS) {
		const [i1, i2, i3] = pattern;

		if (
			arrOfCells[i1].value === arrOfCells[i2].value &&
			arrOfCells[i1].value === arrOfCells[i3].value &&
			!!arrOfCells[i1].value
		) {
			return arrOfCells[i1].player;
		}
	}
	return;
};

export { findWinner };
