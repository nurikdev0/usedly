//TASK ZU

function sumOfUnique(nums: number[]): number {
	const countMap = new Map<number, number>();

	for (const num of nums) {
		countMap.set(num, (countMap.get(num) || 0) + 1);
	}

	let sum = 0;
	for (const [num, count] of countMap) {
		if (count === 1) {
			sum += num;
		}
	}

	return sum;
}

console.log(sumOfUnique([1, 2, 3, 2]));

///////////////////////////////////
//TASK ZT

// function firstUniqueCharIndex(str: string): number {
// 	const charCount: Record<string, number> = {};

// 	for (const char of str) {
// 		charCount[char] = (charCount[char] || 0) + 1;
// 	}

// 	for (let i = 0; i < str.length; i++) {
// 		if (charCount[str[i]] === 1) {
// 			return i;
// 		}
// 	}

// 	return -1;
// }
// console.log(firstUniqueCharIndex('stamp'));

///////////////////////////////////
//TASK ZS

// function findUniqueNumbers(arr: number[]): number[] {
// 	const map = new Map<number, number>();

// 	for (const num of arr) {
// 		map.set(num, (map.get(num) || 0) + 1);
// 	}

// 	const unique = [];
// 	for (const [key, value] of map.entries()) {
// 		if (value === 1) {
// 			unique.push(key);
// 		}
// 	}

// 	return unique;
// }

// console.log(findUniqueNumbers([4, 2, 1, 2, 1]));
// console.log(findUniqueNumbers([1, 2, 3, 4]));

/////////////////////////////////
//TASK ZR

// function countNumberAndLetters(input: string): { number: number; letter: number } {
// 	let numberCount = 0;
// 	let letterCount = 0;

// 	for (const char of input) {
// 		if (/[0-9]/.test(char)) {
// 			numberCount++;
// 		} else if (/[a-zA-Z]/.test(char)) {
// 			letterCount++;
// 		}
// 	}

// 	return {
// 		number: numberCount,
// 		letter: letterCount,
// 	};
// }

// console.log(countNumberAndLetters('string152%\\¥'));

///////////////////////////////////
//TASK ZP

// function findDuplicates(arr: number[]): number[] {
// 	const countMap = new Map<number, number>();
// 	const result: number[] = [];

// 	for (const num of arr) {
// 		const count = countMap.get(num) || 0;
// 		countMap.set(num, count + 1);
// 	}

// 	for (const [num, count] of countMap.entries()) {
// 		if (count >= 2) {
// 			result.push(num);
// 		}
// 	}

// 	return result;
// }
// console.log(findDuplicates([1, 2, 3, 4, 5, 4, 3, 4]));

//////////////////////////////////////////
//TASK ZP

// function areArraysEqual(arr1: any[], arr2: any[]): boolean {
// 	const countMap = (arr: any[]) => {
// 		const map = new Map<any, number>();
// 		for (const item of arr) {
// 			map.set(item, (map.get(item) || 0) + 1);
// 		}
// 		return map;
// 	};

// 	const map1 = countMap(arr1);
// 	const map2 = countMap(arr2);

// 	for (const [key, count] of map1.entries()) {
// 		if ((map2.get(key) || 0) < count) {
// 			return false;
// 		}
// 	}

// 	return true;
// }

// console.log(areArraysEqual([1, 2, 3], [3, 1, 2]));
// console.log(areArraysEqual([1, 2, 3], [3, 1, 2, 1]));
// console.log(areArraysEqual([1, 2, 3], [4, 1, 2]));
// console.log(areArraysEqual([1, 2, 2], [2, 1, 2]));
// console.log(areArraysEqual([1, 2, 2], [2, 1]));

//////////////////////////////////
//TASK ZO

// function areParenthesesBalanced(input: string): boolean {
// 	let balance = 0;

// 	for (const char of input) {
// 		if (char === '(') {
// 			balance++;
// 		} else if (char === ')') {
// 			balance--;

// 			if (balance < 0) return false;
// 		}
// 	}

// 	return balance === 0;
// }

// console.log(areParenthesesBalanced('string()ichida(qavslar)soni()balansda'));

////////////////////////////////
//TASK ZN

// function rotateArray(arr: number[], index: number): number[] {
// 	const before = arr.slice(0, index + 1);
// 	const after = arr.slice(index + 1);
// 	return [...after, ...before];
// }

// const result = rotateArray([1, 2, 3, 4, 5, 6, 7, 8], 3);
// console.log(result);

//////////////////////////////////
//TASK ZM

// function stringToKebab(str: string): string {
// 	return str
// 		.toLowerCase()
// 		.trim()
// 		.replace(/\s+/g, '-')
// 		.replace(/[^a-z0-9\-]/g, '');
// }

// console.log(stringToKebab('I love Kebab'));

////////////////////////////////////
//TASK ZL

// function reverseInteger(num: number): number {
// 	const reversed = num.toString().split('').reverse().join('');
// 	return parseInt(reversed);
// }
// console.log(reverseInteger(123456789));

///////////////////////////////////////
//TASK ZJ
// function printNumbers(): void {
// 	let count = 1;

// 	const intervalId = setInterval(() => {
// 		console.log(count);
// 		count++;

// 		if (count > 5) {
// 			clearInterval(intervalId);
// 		}
// 	}, 1000);
// }

// printNumbers();

///////////////////////////////////////////
//TASK ZJ
// function reduceNestedArray(arr: any[]): number {
// 	return arr.reduce((sum, current) => {
// 		if (Array.isArray(current)) {
// 			return sum + reduceNestedArray(current); // recursive call
// 		} else if (typeof current === 'number') {
// 			return sum + current;
// 		} else {
// 			return sum;
// 		}
// 	}, 0);
// }

// const result = reduceNestedArray([1, [1, 2, [4]]]);
// console.log(result);
