/*var resposta = confirm("Deseja confirmar?");

console.log(resposta);*/

const a = 10;
const b = 22;

function somar(a, b){
	return a + b;
}

//console.log(somar(1, 5));


document.querySelector('#calcular').addEventListener('click', e=>{

let valueA = parseInt(document.querySelector('#valorA').value);
let valueB = parseInt(document.querySelector('#valorB').value);

let result = somar(valueA, valueB);


if(valueA && valueB)
	document.querySelector('.resultado').innerHTML = result;
else
	alert("Fill all the fields")

	console.log('oi',e);
})