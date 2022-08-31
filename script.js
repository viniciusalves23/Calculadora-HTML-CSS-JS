// NOTE: 
// This is the final source code file for a blog post "How to build a calculator". You can follow the lesson at https://zellwk.com/blog/calculator-part-3

const calcular = (n1, teclaOperacao, n2) => {
    const primeiroNumero = parseFloat(n1)
    const segundoNumero = parseFloat(n2)
    if (teclaOperacao === 'adicionar') return primeiroNumero + segundoNumero
    if (teclaOperacao === 'subtrair') return primeiroNumero - segundoNumero
    if (teclaOperacao === 'multiplicar') return primeiroNumero * segundoNumero
    if (teclaOperacao === 'dividir') return primeiroNumero / segundoNumero
  }
  
  const getTeclaTipo = tecla => {
    const { action } = tecla.dataset
    if (!action) return 'numero'
    if (
      action === 'adicionar' ||
      action === 'subtrair' ||
      action === 'multiplicar' ||
      action === 'dividir'
    ) return 'teclaOperacao'
    // For everything else, return the action
    return action
  }
  
  const criarResultadoString = (tecla, numeroDisplay, estado) => {
    const teclaChave = tecla.textContent
    const teclaTipo = getTeclaTipo(tecla)
    const {
      primeiroValor,
      teclaOperacao,
      valorModulo,
      teclaTipoAnterior
    } = estado
  
    if (teclaTipo === 'numero') {
      return numeroDisplay === '0' ||
        teclaTipoAnterior === 'teclaOperacao' ||
        teclaTipoAnterior === 'calcular'
        ? teclaChave
        : numeroDisplay + teclaChave
    }
  
    if (teclaTipo === 'decimal') {
      if (!numeroDisplay.includes('.')) return numeroDisplay + '.'
      if (teclaTipoAnterior === 'teclaOperacao' || teclaTipoAnterior === 'calcular') return '0.'
      return numeroDisplay
    }
  
    if (teclaTipo === 'teclaOperacao') {
      return primeiroValor &&
        teclaOperacao &&
        teclaTipoAnterior !== 'teclaOperacao' &&
        teclaTipoAnterior !== 'calcular'
        ? calcular(primeiroValor, teclaOperacao , numeroDisplay)
        : numeroDisplay
    }
  
    if (teclaTipo === 'limpar') return 0
  
    if (teclaTipo === 'calcular') {
      return primeiroValor
        ? teclaTipoAnterior === 'calcular'
          ? calcular(numeroDisplay, teclaOperacao, valorModulo)
          : calcular(primeiroValor, teclaOperacao, numeroDisplay)
        : numeroDisplay
    }
  }
  
  const atualizarEstadoCalculadora = (tecla, calculadora, valorCalculado, numeroDisplay) => {
    const teclaTipo = getTeclaTipo(tecla)
    const {
      primeiroValor,
      teclaOperacao,
      valorModulo,
      teclaTipoAnterior
    } = calculadora.dataset
  
    calculadora.dataset.teclaTipoAnterior = teclaTipo
  
    if (teclaTipo === 'teclaOperacao') {
      calculadora.dataset.teclaOperacao = tecla.dataset.action
      calculadora.dataset.primeiroValor = primeiroValor &&
        teclaOperacao &&
        teclaTipoAnterior !== 'teclaOperacao' &&
        teclaTipoAnterior !== 'calcular'
        ? valorCalculado
        : numeroDisplay
    }
  
    if (teclaTipo === 'calcular') {
      calculadora.dataset.valorModulo = primeiroValor && teclaTipoAnterior === 'calcular'
        ? valorModulo
        : numeroDisplay
    }
  
    if (teclaTipo === 'limpar' && tecla.textContent === 'AC') {
      calculadora.dataset.primeiroValor = ''
      calculadora.dataset.valorModulo = ''
      calculadora.dataset.teclaOperacao = ''
      calculadora.dataset.teclaTipoAnterior = ''
    }
  }
  
  const atualizarEstadoVisual = (tecla, calculadora) => {
    const teclaTipo = getTeclaTipo(tecla)
    Array.from(tecla.parentNode.children).forEach(k => k.classList.remove('is-depressed'))
  
    if (teclaTipo === 'teclaOperacao') tecla.classList.add('is-depressed')
    if (teclaTipo === 'limpar' && tecla.textContent !== 'AC') tecla.textContent = 'AC'
    if (teclaTipo !== 'limpar') {
      const limparBotao = calculadora.querySelector('[data-action=limpar]')
      limparBotao.textContent = 'CE'
    }
  }
  
  const calculadora = document.querySelector('.calculadora')
  const display = calculadora.querySelector('.calculadoraDisplay')
  const teclas = calculadora.querySelector('.calculadoraTeclas')
  
  teclas.addEventListener('click', e => {
    if (!e.target.matches('button')) return
    const tecla = e.target
    const numeroDisplay = display.textContent
    const resultadoString = criarResultadoString(tecla, numeroDisplay, calculadora.dataset)
  
    display.textContent = resultadoString
    atualizarEstadoCalculadora(tecla, calculadora, resultadoString, numeroDisplay)
    atualizarEstadoVisual(tecla, calculadora)
  })
  