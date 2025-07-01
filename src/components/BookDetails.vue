<!--
 * @Author: 汪培良 rick_wang@yunquna.com
 * @Date: 2025-07-01 11:28:30
 * @LastEditors: 汪培良 rick_wang@yunquna.com
 * @LastEditTime: 2025-07-01 11:28:58
 * @FilePath: /AI-project/berarbobo-discovery/src/components/BookDetails.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<script setup lang="ts">
import { marked } from 'marked';
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
    }
});
</script>

<template>
    <div v-if="expand" class="details" @click.stop="">
        <div class="cover">
            <img :src="image || 'https://res.bearbobo.com/resource/upload/hR5b3aZt/10wwhys-aszp2n7g6wp.jpeg'"
                alt="book cover" class="img-fluid" />
        </div>
        <h1>{{ question }}</h1>
        <p class="introduction" v-html="marked.parse(introduction)"></p>
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
</style>