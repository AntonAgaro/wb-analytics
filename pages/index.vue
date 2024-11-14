<template>
  <div>
    <div class="container">
      <form class="pt-2.5 flex gap-1.5" @submit.prevent="search">
        <UInput class="flex-grow " v-model="searchValue" />
        <UButton type="submit">Поиск</UButton>
      </form>
      <div class="flex gap-1.5 mt-5">
        <UButton v-if="wbRes.length" @click="mode = ViewMode.wb" :color="mode === ViewMode.wb ? 'primary' : 'gray'">WB</UButton>
        <UButton v-if="mpStatRes.length"  @click="mode = ViewMode.mpStat" :color="mode === ViewMode.mpStat ? 'primary' : 'gray'">MPStat</UButton>
      </div>
      <UTable v-if="wbRes.length && mode === ViewMode.wb" class="mt-10" :rows="wbRes" >
        <template #sizes-data="{row, column, getRowData}">

          <UDropdown :items="getRowData().map(item => {item.label = item.name; return item})" />
        </template>
<!--        <template #actions-data="{ row }">-->
<!--          <UDropdown :items="items(row)">-->
<!--            <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />-->
<!--          </UDropdown>-->
<!--        </template>-->
      </UTable>
      <UTable v-if="mpStatRes.length && mode === ViewMode.mpStat" class="mt-10" :rows="mpStatRes" >
      </UTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import {clientFetch} from "~/utils/functions";
enum ViewMode {
  wb = 'wb',
  mpStat = 'mpStat'
}

const searchValue = ref('')
const wbRes = ref([])
const mpStatRes = ref([])
const mode = ref<ViewMode>(ViewMode.wb)

async function search() {
  const res = await clientFetch('/api/search', {
    method: 'POST',
    body: JSON.stringify({searchValue: searchValue.value})
  })
  console.log(res)
  if (res.dataByWBSearch) {
    const data = JSON.parse(res.dataByWBSearch)
    console.log(data)
    wbRes.value = data.data.products
  }

  if (res.dataByMPstats) {
    mpStatRes.value = res.dataByMPstats.data.products
  }
  // const res = await clientFetch(`https://search.wb.ru/exactmatch/ru/common/v7/search?appType=64&curr=rub&dest=-1257786&query=${searchValue.value}&resultset=catalog&sort=popular&spp=30&suppressSpellcheck=false`)
  // console.log(res)
}

</script>

<style scoped>
</style>