import { test, expect } from '@playwright/test'

test.describe('Command Palette should', () => {
  async function openCommandPalette (page) {
    await page.keyboard.down('Control')
    await page.keyboard.down('Shift')
    await page.keyboard.press('H')
    await page.keyboard.up('Shift')
    await page.keyboard.up('Control')
  }

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await openCommandPalette(page)
  })

  test('be visible', async ({ page }) => {
    const commandPalette = await page.$('#command-palette')
    expect(commandPalette).toBeTruthy()
    const isVisible = await commandPalette.isVisible()
    expect(isVisible).toBeTruthy()
  })

  test('display an alert when selecting "Alert" command with Enter', async ({ page }) => {
    // Assuming "Alert" is the second command in the list
    await page.keyboard.press('ArrowDown') // Navigate to "Alert"
    await page.keyboard.press('Enter') // Select "Alert"

    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Executed Command 2')
      await dialog.dismiss()
    })
  })

  test('display an alert when selecting "Alert" command with mouse click', async ({ page }) => {
    // Assuming "Alert" is the second command in the list
    const alertCommand = await page.$('#command-list li:nth-child(2)')
    await alertCommand.click()

    page.once('dialog', async dialog => {
      expect(dialog.message()).toBe('Executed Command 2')
      await dialog.dismiss()
    })
  })

  test('display all commands', async ({ page }) => {
    const commandList = await page.$$('#command-list li')
    expect(commandList.length).toBe(2)
    expect(await commandList[0].innerText()).toBe('Print')
    expect(await commandList[1].innerText()).toBe('Alert')
  })

  test('display only matching commands when filtering', async ({ page }) => {
    const commandInput = await page.$('#command-input')
    await commandInput.fill('A')

    const commandList = await page.$$('#command-list li')
    expect(commandList.length).toBe(1)
    expect(await commandList[0].innerText()).toBe('Alert')
  })
})
