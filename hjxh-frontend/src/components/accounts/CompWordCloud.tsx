import React from "react";
import ReactWordcloud, {Word} from "react-wordcloud";


const words: Word[] = [
  '石总',
  "梦婷",
  '兵哥',
  '飞勇哥'
].map(s => ({
  text: s,
  value: 100
}))

/**
 * refer: - [echarts-wordcloud - npm](https://www.npmjs.com/package/echarts-wordcloud)
 *
 * @constructor
 */
export const CompWordCloud = () => {


  return (
    <ReactWordcloud words={words}/>
  )
}

export default CompWordCloud
