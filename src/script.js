// Took most of the part from here and modified some parts to match the needs.
// https://codepen.io/REast/details/LYXZoQ


var board, wordArr, wordBank, wordsActive, mode;

function WordObj(stringValue) {
  this.string = stringValue;
  this.char = stringValue.split("");
  this.successfulMatches = [];
}

var Bounds = {
  top: 0, right: 0, bottom: 0, left: 0,

  Update: function (x, y) {
    this.top = Math.min(y, this.top);
    this.right = Math.max(x, this.right);
    this.bottom = Math.max(y, this.bottom);
    this.left = Math.min(x, this.left);
  },

  Clean: function () {
    this.top = 999;
    this.right = 0;
    this.bottom = 0;
    this.left = 999;
  }
};

export function CreateCrossWord() {

  // needs to be sorted according to size of srtings! Otherwise invalid patterns can occur.
  wordArr = ["seat", "east", "eat", "tea", "set"];
  for (var i = 0, isSuccess = false; i < 10 && !isSuccess; i++) {
    CleanVars();
    isSuccess = PopulateBoard();
  }
  return BoardToString(" ")
}

function CleanVars() {
  Bounds.Clean();
  wordBank = [];
  wordsActive = [];
  board = [];

  for (var i = 0; i < 20; i++) {
    board.push([]);
    for (var j = 0; j < 20; j++) {
      board[i].push(null);
    }
  }
}


function PopulateBoard() {
  PrepareBoard();

  for (var i = 0, isOk = true, len = wordBank.length; i < len && isOk; i++) {
    isOk = AddWordToBoard();
  }
  return isOk;
}


function PrepareBoard() {
  wordBank = [];

  for (var i = 0, len = wordArr.length; i < len; i++) {
    wordBank.push(new WordObj(wordArr[i]));
  }
}

function AddWordToBoard() {
  var i, len, curIndex, curWord, curChar, testWord, testChar;
  if (wordsActive.length < 1) {
    curIndex = 0
    wordBank[curIndex].successfulMatches = [{ x: 12, y: 12, dir: 0 }];
  }
  else {
    curIndex = -1;

    for (i = 0, len = wordBank.length; i < len; i++) {
      curWord = wordBank[i];
      curWord.successfulMatches = [];

      for (var j = 0, lenJ = curWord.char.length; j < lenJ; j++) {

        curChar = curWord.char[j];
        for (var k = 0, lenK = wordsActive.length; k < lenK; k++) {

          testWord = wordsActive[k];
          for (var l = 0, lenL = testWord.char.length; l < lenL; l++) {
            testChar = testWord.char[l];

            // check if a vaild match where new word can cross.
            if (curChar === testChar) {

              var curCross = { x: testWord.x, y: testWord.y, dir: 0 };

              // transfrom to the frame of curWord (at which position of curWord ?)
              if (testWord.dir === 0) {
                curCross.dir = 1;
                curCross.x += l;
                curCross.y -= j;
              }
              else {
                curCross.dir = 0;
                curCross.y += l;
                curCross.x -= j;
              }

              var isMatch = true;
              // now need to check if any violations occur, meaningless words occur.
              // -1 and +1 due to check before and after end/start since connections can generate new meaningless words.
              for (var m = -1, lenM = curWord.char.length + 1; m < lenM; m++) {
                var crossVal = [];
                // don't check crossing position don't matter
                if (m !== j) {
                  if (curCross.dir === 0) {
                    var xIndex = curCross.x + m;

                    if (xIndex < 0 || xIndex > board.length) {
                      isMatch = false;
                      break;
                    }

                    crossVal.push(board[xIndex][curCross.y]);
                    crossVal.push(board[xIndex][curCross.y + 1]);
                    crossVal.push(board[xIndex][curCross.y - 1]);
                  }
                  else {
                    var yIndex = curCross.y + m;

                    if (yIndex < 0 || yIndex > board.length) {
                      isMatch = false;
                      break;
                    }

                    crossVal.push(board[curCross.x][yIndex]);
                    crossVal.push(board[curCross.x + 1][yIndex]);
                    crossVal.push(board[curCross.x - 1][yIndex]);
                  }
                  // check overlapping positions
                  if (m > -1 && m < lenM - 1) {
                    if (crossVal[0] !== curWord.char[m]) {
                      if (crossVal[0] !== null) {
                        isMatch = false;
                        break;
                      }
                      else if (crossVal[1] !== null) {
                        isMatch = false;
                        break;
                      }
                      else if (crossVal[2] !== null) {
                        isMatch = false;
                        break;
                      }
                    }
                  }

                  // starting/end position needs to be free
                  else if (crossVal[0] !== null) {
                    isMatch = false;
                    break;
                  }
                }
              }

              if (isMatch === true) {
                curWord.successfulMatches.push(curCross);
              }
            }
          }
        }
      }
      // end of second for loop
      if (curWord.successfulMatches.length > 0) {
        curIndex = i;
        break;
      }
      else {
        curIndex = -1;
      }
    } // end of first for loop
  }

  if (curIndex === -1) {
    return false;
  }

  // curIndex is selected word
  var spliced = wordBank.splice(curIndex, 1);
  wordsActive.push(spliced[0]);

  var pushIndex = wordsActive.length - 1,
    rand = Math.random(),
    matchArr = wordsActive[pushIndex].successfulMatches,
    matchIndex = Math.floor(rand * matchArr.length),
    matchData = matchArr[matchIndex];

  wordsActive[pushIndex].x = matchData.x;
  wordsActive[pushIndex].y = matchData.y;
  wordsActive[pushIndex].dir = matchData.dir;

  // populate board add word to board, the chars of the word
  // console.log(wordsActive[pushIndex])
  for (i = 0, len = wordsActive[pushIndex].char.length; i < len; i++) {
    var xIndex = matchData.x,
      yIndex = matchData.y;

    if (matchData.dir === 0) {
      xIndex += i;
      board[xIndex][yIndex] = wordsActive[pushIndex].char[i];
    }
    else {
      yIndex += i;
      board[xIndex][yIndex] = wordsActive[pushIndex].char[i];
    }

    Bounds.Update(xIndex, yIndex);
  }

  return true;
}



function BoardToString(blank) {
  var strArr = []
  var arrStart = 0;
  for (var i = Bounds.top, str = ""; i <= Bounds.bottom; i++) {
    strArr.push([]);
    for (var j = Bounds.left; j <= Bounds.right; j++) {
      strArr[arrStart].push(BoardCharToChar(board[j][i]))
      // str += BoardCharToChar(board[j][i]);
    }
    arrStart++;
    // str += "\n";
  }
  return strArr;
}


function BoardCharToChar(c) {
  return (c) ? c : '';
}

