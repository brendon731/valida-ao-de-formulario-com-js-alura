import { valid } from "./validaçao.js"

const inputs = document.querySelectorAll("input")

inputs.forEach(input=>{
    if(input.dataset.tipo === "preco"){
        const args = {
            negativeSignAfter: false,
            prefix: 'R$ ',
            fixed: true,
            fractionDigits: 2,
            decimalSeparator: ',',
            thousandsSeparator: '.',
            cursor: 'end'
          };
    
        SimpleMaskMoney.setMask(input, args);
    }
    
    input.addEventListener("blur", (evt)=>{
        valid(evt) 
        
    })
})