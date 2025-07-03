/*
 * @Author: 汪培良 rick_wang@yunquna.com
 * @Date: 2025-07-03 17:58:57
 * @LastEditors: 汪培良 rick_wang@yunquna.com
 * @LastEditTime: 2025-07-03 17:59:10
 * @FilePath: /AI-project/berarbobo-discovery/src/utils/audio.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export async function convertToWav(buffer: ArrayBuffer) {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  
  try {
    const audioBuffer = await audioCtx.decodeAudioData(buffer);
    const wavBuffer = encodeWAV(audioBuffer);
    return new Blob([wavBuffer], { type: 'audio/wav' });
  } finally {
    audioCtx.close();
  }
}

function encodeWAV(audioBuffer: AudioBuffer) {
  // WAV编码实现...
}