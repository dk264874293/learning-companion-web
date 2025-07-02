<!--
 * @Author: 汪培良 rick_wang@yunquna.com
 * @Date: 2025-06-26 11:19:19
 * @LastEditors: 汪培良 rick_wang@yunquna.com
 * @LastEditTime: 2025-07-01 16:49:09
 * @FilePath: /AI-project/berarbobo-discovery/src/App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->


<script setup lang="ts">
import { ref, type Ref } from 'vue';
import { set, get } from 'jsonuri';
import { marked } from 'marked';
import MakeQuestion from './components/MakeQuestion.vue';
import BookCard from './components/BookCard.vue';
import BookDetails from './components/BookDetails.vue';

const question = ref('天空为什么是蓝色的？');

const rewritedQuestions: Ref<Array<string>> = ref([]);

let queries: string[][] = [];

const update = async () => {
  if (!question) return;
  rewritedQuestions.value = [];
  quickAnswer.value = '';
  // queries = [];

  const endpoint = '/chat/make-question';
  const eventSource = new EventSource(`http://localhost:3000${endpoint}?question=${question.value}`);

  eventSource.addEventListener("message", function (e: any) {
    let { uri, delta } = JSON.parse(e.data);
    let matches = uri.match(/questions\/(\d+)\/question$/);
    if (matches) {
      const index = parseInt(matches[1]);
      rewritedQuestions.value[index] = rewritedQuestions.value[index] || '';
      rewritedQuestions.value[index] += delta;
    }
    matches = uri.match(/questions\/(\d+)\/query\/(\d+)$/);
    if (matches) {
      const index = parseInt(matches[1]);
      const queryIndex = parseInt(matches[2]);
      queries[index] = queries[index] || [];
      queries[index][queryIndex] = queries[index][queryIndex] || '';
      queries[index][queryIndex] += delta;
    }
  });
  eventSource.addEventListener('finished', () => {
    console.log('传输完成');
    eventSource.close();
  });
}

const coverUrl = ref('');
const quickAnswer = ref('');
const description = ref('');
const details: any = { topics: [] };
const topics: Ref = ref([]);
const questionSelected = (question: string, index: number) => { 
  console.log('1')

  quickAnswer.value = ''; 
  description.value = ''; 
  const query = queries[index].join(';'); 
  const endpoint = '/chat/generate'; 
  const eventSource = new EventSource(`http://localhost:3000${endpoint}?question=${question}&query=${query}`); 
  eventSource.addEventListener("message", function (e: any) { 
    let { uri, delta } = JSON.parse(e.data); 
    console.log('uri, delta', uri, delta)
    if (uri.endsWith('quick-answer')) { 
      quickAnswer.value += delta; 
    } 
    if (uri.endsWith('introduction')) { 
      description.value += delta;
    } 
    if (uri.endsWith('cover_image')) { 
      coverUrl.value = delta;
    } 
    if (uri.startsWith('topics')) { 
      let content = get(details, uri) || '';
      console.log('content', content)
       set(details, uri, content + delta); 
       topics.value = [...details.topics];
    }
  }); 
  eventSource.addEventListener('finished', () => { 
    console.log('传输完成'); eventSource.close(); 
  });
}

const expand = ref(false);
const showDetails = () => {
  setTimeout(() => {
    if (!expand.value) expand.value = true;
  });
}

</script>

<template>
  <div class="container">
    <div>
      <label>输入：</label><input class="input" v-model="question" />
      <button @click="update">提交</button>
    </div>
    <div class="output">
      <MakeQuestion :questions="rewritedQuestions" @selection="questionSelected" />
      <div v-html="marked.parse(quickAnswer)"></div>
      <BookCard :image="coverUrl" :description="description" :question="question" @expand="showDetails()" />
    </div>
    <BookDetails :image="coverUrl" :expand="expand" :introduction="description" :question="question" :topics="topics" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  width: 100%;
  height: 100vh;
  font-size: .85rem;
}

.input {
  width: 200px;
}

.output {
  margin-top: 30px;
  min-height: 300px;
  width: 100%;
  text-align: left;
}
</style>