"use client";

import React, {useState, useEffect} from "react";

interface WordCloudWord {
    text: string;
    value: number;
  }
  interface WordCloudProps {
    words: WordCloudWord[];
    primaryWord: string;
  }
  
  // given a list of words and their strength relative a primary word, display a word cloud of words that are horizontally 
  // and vertically tiled, with the highest strength words in the center and the lowest strength words on the outside 
  export const WordCloud: React.FC<WordCloudProps> = ({ words, primaryWord }) => {
  
    const canvasRef = React.useRef(null);
  
    // sort words by strength
    words.sort((a: WordCloudWord, b: WordCloudWord) => {
      return a.value - b.value;
    });
  
    // get the index of the primary word
    const primaryWordIndex = words.findIndex((word: WordCloudWord) => {
      return word.text === primaryWord;
    });
  
    const relativeWidth = (thisElWidth: number, otherElRelativeWidth: number) => {
      return thisElWidth * otherElRelativeWidth;
    }
  
    const wordWidth = (word: WordCloudWord) => {
      return relativeWidth(100, word.value);
    }
    return (
      <div className="word-cloud">
        <canvas id="hiddenCanvas" ref={canvasRef} className="hidden-canvas"></canvas>
        {words.map((word: WordCloudWord, index: number) => {
          return (
            <div className="word" key={index} id={`word-${index}`} style={{ width: `${wordWidth(word)}px` }}>
              {word.text}
            </div>
          );
        })}
      </div>
    );
  }
  