
export function valid({ target }){
    const inputType = target.dataset.tipo

    if(validators[inputType]){
        validators[inputType](target)
    }

    
    if(target.validity.valid){
        target.parentNode.classList.remove("input-container--invalido") 
        target.parentNode.querySelector(".input-mensagem-erro").innerHTML = ""
        
    }else{
        target.parentNode.classList.add("input-container--invalido")
        target.parentNode.querySelector(".input-mensagem-erro").innerHTML = errorMessage(inputType, target)

    }
}

const validators = {
    nascimento: (data) => birth.validate(data),
    cpf: (data) => CPF.validate(data),
    cep: (input) => CEP.validate(input)

}

function errorMessage(inputType, input){
    let message = ""

    errorTypes.forEach(error=>{
        if(input.validity[error]){
            message = errorMessages[inputType][error]
        }
    })
    return message
}

const errorTypes = [
    "valueMissing", 
    "patternMismatch",
    "typeMismatch",
    "customError"
]

const errorMessages = {
    nome:{
        valueMissing:"O campo nome não pode estar vazio."
    },
    email:{
        valueMissing:"O campo de email não pode estar vazio.",
        typeMismatch:"O email digitado não é valido."
    },
    senha:{
        valueMissing:"O campo de senha não pode estar vazio.",
        patternMismatch:`A senha deve conter de 8 a 12 caracteres,
        uma letra maiúscula, uma minúscula, um caractere especial ($*&@#), e não deve conter símbolos.`
    },
    nascimento:{
        valueMissing:"O campo de data de nascimento não pode estar vazio.",
        customError:"Você deve termais de 18 anos para se cadastrar"
    },
    cpf:{
        customError:"Digite um CPF válido.",
        valueMissing:"O campo de CPF não pode estar vazio."
    },
    cep:{
        valueMissing:"O campo CEP não pode estar vazio.",
        patternMismatch:`Informe um CEP válido.`,
        customError:"CEP não encontrado."
    },
    logradouro:{
        valueMissing:"O campo de logradouro não pode estar vazio."
    },
    cidade:{
        valueMissing:"O campo de cidade não pode estar vazio."
    },
    estado:{
        valueMissing:"O campo de estado não pode estar vazio."
    },
    preco:{
        valueMissing:"O campo preço não pode estar vazio."
    },
    descrição:{
        valueMissing:"O campo Descrição não pode estar vazio."
    }
}

const CEP = {
    validate(input){

        let cep = input.value.replace("/\D/g", "")
    
        const url = `https://viacep.com.br/ws/${cep}/json`;
    
        const options = {
            method: "GET",
            mode: "cors",
            headers: {
                'content-type': 'application/json;charset=utf-8',
            }
        }
        if(!input.validity.patternMismatch && !input.validity.valueMissing) {
            fetch(url, options)
            .then(response => response.json())
            .then(data => {
                    if(data.erro) throw new Error("CEP não econtrado")
    
                    input.parentNode.classList.remove("input-container--invalido")
                    input.parentNode.querySelector(".input-mensagem-erro").innerHTML =""
    
                    input.setCustomValidity("")
                    this.setAdress(data)
                }
            ).catch(erro=>{
                input.setCustomValidity(erro)
                this.setAdress({})
    
                input.parentNode.classList.add("input-container--invalido")
                input.parentNode.querySelector(".input-mensagem-erro").innerHTML = errorMessage("cep", input)
            })
        }
    
    
    },
    setAdress({logradouro="", localidade="", uf=""}){
        document.querySelector("[data-tipo='logradouro']").value = logradouro
        document.querySelector("[data-tipo='cidade']").value = localidade
        document.querySelector("[data-tipo='estado']").value = uf
    }
}


const birth = {

    validate(data){
        const inputValue = new Date(data.value)
        let message = ""
        
        if(!this.isOlderThan18(inputValue)){
            
            message = "Você deve ter mais de 18 anos para se cadastrar"
        }
        data.setCustomValidity(message)
    },
    isOlderThan18(data){
    
        const today = new Date()
        const dateOf18 = new Date(data.getUTCFullYear() + 18, data.getUTCMonth(), data.getUTCDate())
        return today >= dateOf18
        
    }
}
const CPF = {

    validate(input){

        let cpf = input.value.replace(/\D/g, "")
        let message = ""
    
        if(this.checkRepeatNumbers(cpf) || !this.checkCPFStructure(cpf)){
            message="Digite um CPF válido."
        }
        input.setCustomValidity(message)
    
    },
    
    checkRepeatNumbers(cpf){
        let isInvalid = false
        let invalids = [
            "11111111111",
            "22222222222",
            "33333333333",
            "44444444444",
            "55555555555",
            "66666666666",
            "77777777777",
            "88888888888",
            "99999999999"
        ]
        invalids.forEach(invalidCPF=>{
            if(cpf === invalidCPF){
                isInvalid = true
            }
        })
        return isInvalid
    },
    
    checkCPFStructure(cpf){
        let multiplier = 10
    
        return this.checkVerifyDigit(cpf, multiplier)
    }
    ,
    checkVerifyDigit(cpf, multiplier){
        if(multiplier >= 12) return true

        let sum = 0
        let cpfNoDigits = cpf.substr(0, multiplier - 1).split("")
        let verifiedDigite = cpf.charAt(multiplier - 1)
        
        for(let i = multiplier; i >= 2; i--){
            
            sum += i * cpfNoDigits[multiplier - i]
        }
    
        if(verifiedDigite == this.confirmDigite(sum)){
            return this.checkVerifyDigit(cpf, multiplier + 1)
        }
    
        return false
    
    },
    
    confirmDigite(sum){
        return 11 - (sum % 11)
    }
}


