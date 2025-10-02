import HubApi from '@nimiq/hub-api'

const hubApi = new HubApi('https://hub.nimiq-testnet.com')

function updateStatus(message: string, type: 'info' | 'success' | 'error' = 'info') {
  const statusEl = document.getElementById('status')
  if (!statusEl)
    return

  statusEl.textContent = message
  statusEl.className = `status-value ${type === 'info' ? '' : type}`
}

async function handleChooseAddress() {
  updateStatus('Opening Hub to choose address...')

  try {
    const result = await hubApi.chooseAddress({
      appName: 'Hub API Starter',
    })

    updateStatus(`Selected address: ${result.address} (${result.label})`, 'success')
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    if (message === 'Request was cancelled') {
      updateStatus('Address selection cancelled', 'error')
    }
    else {
      updateStatus(`Error: ${message}`, 'error')
    }
  }
}

async function handleSignMessage() {
  updateStatus('Opening Hub to sign message...')

  try {
    const result = await hubApi.signMessage({
      appName: 'Hub API Starter',
      message: 'Hello from Nimiq Hub API!',
    })

    const sigHex = Array.from(result.signature).map(b => b.toString(16).padStart(2, '0')).join('')
    updateStatus(`Message signed by ${result.signer}. Signature: ${sigHex.slice(0, 32)}...`, 'success')
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    if (message === 'Request was cancelled') {
      updateStatus('Message signing cancelled', 'error')
    }
    else {
      updateStatus(`Error: ${message}`, 'error')
    }
  }
}

async function handleCheckout() {
  updateStatus('Opening Hub to request payment...')

  try {
    const result = await hubApi.checkout({
      appName: 'Hub API Starter',
      recipient: 'NQ07 0000 0000 0000 0000 0000 0000 0000 0000',
      value: 100000, // 1 NIM in Luna
      extraData: 'Test payment',
    })

    updateStatus(`Payment successful! TX: ${result.hash}`, 'success')
  }
  catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    if (message === 'Request was cancelled') {
      updateStatus('Payment cancelled', 'error')
    }
    else {
      updateStatus(`Error: ${message}`, 'error')
    }
  }
}

// Setup event listeners
document.getElementById('choose-address')?.addEventListener('click', handleChooseAddress)
document.getElementById('sign-message')?.addEventListener('click', handleSignMessage)
document.getElementById('checkout')?.addEventListener('click', handleCheckout)
