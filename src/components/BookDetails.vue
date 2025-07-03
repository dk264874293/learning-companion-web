<!--
 * @Author: 汪培良 rick_wang@yunquna.com
 * @Date: 2025-07-01 11:28:30
 * @LastEditors: 汪培良 rick_wang@yunquna.com
 * @LastEditTime: 2025-07-03 17:44:13
 * @FilePath: /AI-project/berarbobo-discovery/src/components/BookDetails.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { marked } from 'marked';
import { ref,type PropType,type Ref } from 'vue';
interface Topic { 
    topic: string, 
    post_reading_question: string, 
    article_paragraph?: string,
    article?: string, 
    image_prompt?: string,
}
defineProps({
    image: {
        type: String,
        default: '',
    },
    question: {
        type: String,
        default: '',
    },
    introduction: {
        type: String,
        default: '',
    },
    expand: {
        type: Boolean,
        default: false,
    },
    topics: {        
        type: Array as PropType<Topic[]>,        
        default: [],    
    }
});

const pictures:Ref<string[]> = ref([]);

const addPic = async (index:number, image_prompt:string) => {
    const picture = pictures.value[index];
    if (picture) return;
    pictures.value[index] = 'https://res.bearbobo.com/resource/upload/e8OEDOJz/loading-5ra4dqqajj4.png'; 
    const res = await fetch(`http://localhost:3000/chat/generate-image?question=${image_prompt}`, 
        { method: 'GET', 
            headers: { 
                'Content-Type': 'application/json',
             }, 
        });
    const data = await res.json();
    console.log('data', data)
     pictures.value[index] = data.output.url;
}

// export async function convertToWav(blob: Blob) {
//   // 使用Web Audio API进行格式转换
//   const audioCtx = new AudioContext();
//   const arrayBuffer = await blob.arrayBuffer();
//   const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
  
//   // 创建WAV格式的Blob
//   const wavBuffer = encodeWAV(audioBuffer);
//   return new Blob([wavBuffer], { type: 'audio/wav' });
// }
const playAudio = async (url: string) => { 
    const audioUrl = `http://localhost:3000${url}`
    // const audioBuffer = await fetch(audioUrl, {
    //     method: 'GET',
    // }).then(res => res.arrayBuffer());
    
    // const blob = new Blob([audioBuffer], { type: 'audio/mpeg' });
    // const url = URL.createObjectURL(blob);
    // new Audio(url).play();

    const res = await fetch(audioUrl)//.then(r => r.blob());
    const audioBlob = new Blob([await res.arrayBuffer()], { type: 'audio/mpeg' });
    console.log('audioBlob', audioBlob)
    const blobUrl = URL.createObjectURL(audioBlob);
    console.log('blobUrl', blobUrl)
    // 添加格式验证
    if (!audioBlob.type.startsWith('audio/')) {
        throw new Error(`不支持的音频格式: ${audioBlob.type}`);
    }

    const audioElement = new Audio();
    audioElement.src = blobUrl;
    audioElement.play().catch(err => {
        console.error('播放失败:', err);
    // 显示错误提示
    });

    // 添加格式回退处理
    // audioElement.addEventListener('error', () => {
    //     const wavBlob = await convertToWav(audioBlob);
    //     audioElement.src = URL.createObjectURL(wavBlob);
    // });
    // console.log('audioUrl', audioUrl)
    // const audio = new Audio(audioUrl); 
    // audio.play();
}


</script>

<template>
    <div v-if="expand" class="details" @click.stop="">
        <div class="cover">
            <img :src="image || 'https://res.bearbobo.com/resource/upload/hR5b3aZt/10wwhys-aszp2n7g6wp.jpeg'"
                alt="book cover" class="img-fluid" />
        </div>
        <h1>{{ question }}</h1>
        <p class="introduction" v-html="marked.parse(introduction)"></p>
        <div class="article">            
            <div v-for="(topic,index) in topics" class="topic" :key="index">                
                <h3 class="topic-title" :class="{ 'topic': true, 'odd': index % 2 === 0, 'even': index % 2 !== 0 }">
                    {{ topic.topic }}
                    <div v-if="topic.image_prompt" class="btn" @click="addPic(index, topic.image_prompt)">配图</div>
                    <div v-if="topic.audio" class="btn" @click="playAudio(topic.audio)">听书</div>
                    {{ topic.audio }}
                </h3> 
                <img v-if="pictures[index]" :src="pictures[index]" alt="插图" />          
                <p class="article_paragraph" v-html="marked.parse(topic.article_paragraph || '')"></p>    
                <p class="post-reading-question">{{ topic.post_reading_question }}</p>      
            </div>        
        </div>
    </div>
</template>

<style scoped>
.details {
    position: absolute;
    top: 90px;
    width: 600px;
    height: 800px;
    overflow-y: auto;
    background-color: white;
    box-shadow: #aaa 0px 0px 10px 10px;
}

.cover {
    height: 260px;
    overflow: hidden;
    position: relative;
}

.img-fluid {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
}

.introduction {
    padding: 20px;
    font-size: 1rem;
    border-bottom: solid 1px #ccc;
}
.topic-title {    
    display: flex;    
    flex-direction: row;    
    margin-top: 40px;
}
.topic:first-child .topic-title {   
     margin: 0;
}
.topic-title h3 {   
    margin: 0;
}
.topic-title .btn {    
    margin-right: 20px;    
    cursor: pointer;
}
.topic-title .btn:first-of-type {    
    margin-left: auto;
}
.topic-title .btn::before {    
    content: "< "
}
.topic-title .btn::after {   
        content: " >"
}
.topic.even img {    
    float: right;    
    margin-left: 20px;
}
.topic img {    
    width: 200px;   
    height: auto;    
    border-radius: 8px;    
    margin-top: 20px;
}
</style>