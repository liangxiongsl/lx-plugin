<script setup lang="ts">
import {defineProps, ref, watchEffect} from 'vue'
import MyPlugin from './main'
let props = defineProps(['ob'])
let ob = props.ob as MyPlugin

let types = []
ob.app.workspace.iterateAllLeaves((leaf)=>{
	types.push(leaf.getViewState().type)
})
console.log(types)

let open = async (type, pos)=>{
	let leaf = !pos ? ob.app.workspace.getLeaf(true) :
		(pos===-1 ? ob.app.workspace.getLeftLeaf(true) : ob.app.workspace.getRightLeaf(true))

	await leaf?.setViewState({type: type, active: true})
	if (leaf) {
		ob.app.workspace.revealLeaf(leaf)
	}
}



</script>

<template>
	<table border="1">
		<thead>
		<tr>
			<th>type</th>
			<th>left</th>
			<th>root</th>
			<th>right</th>
		</tr>
		</thead>
		<tbody>
		<tr v-for="(v) in types">
			<td>{{v}}</td>
			<td><button @click="open(v, -1)">left</button></td>
			<td><button @click="open(v, 0)">root</button></td>
			<td><button @click="open(v, 1)">right</button></td>
		</tr>
		</tbody>
	</table>
</template>

<style scoped>
tr:nth-child(n){
	text-align: center;
}
div{
	width: 100%;
	background-color: white;
}
</style>
