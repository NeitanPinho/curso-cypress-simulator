describe('template spec', () => {

  beforeEach(() => {
      cy.visit('./src/index.html?skipCaptcha=true', {
        onBeforeLoad(win){
          win.localStorage.setItem("cookieConsent", "accepted")
      } })
      cy.get('form > button').click()
    })
  
  it('checks the run button disabled and enabled states', () => {
      cy.contains('button', 'Run')
        .should('be.disabled')  
      cy.get("textarea[placeholder='Write your Cypress code here...']")
        .type('help')
      cy.contains('button', 'Run')
        .should('be.enabled')
      cy.get("textarea[placeholder='Write your Cypress code here...']")
        .clear()
          .should('have.value', "")
      cy.contains('button', 'Run')
        .should('be.disabled')        
  })
  it('clears the code input when logging off then logging in again', () => {
      cy.get("textarea[placeholder='Write your Cypress code here...']")
        .type('cy.visit()').should('have.value', "cy.visit()")
      
      cy.get('#sandwich-menu').click()
      cy.contains('button', 'Logout').click()
      cy.contains('button', 'Login').click()

      cy.get("textarea[placeholder='Write your Cypress code here...']")
        .should('have.value', "")
    
  })
  it('Disable run button on logout and login ', () => {
      cy.get("textarea[placeholder='Write your Cypress code here...']")
        .type('cy.visit()')

      cy.contains('button', 'Run').should('be.enabled')
      
      cy.get('#sandwich-menu').click()
      cy.contains('button', 'Logout').click()
      cy.contains('button', 'Login').click()

      cy.contains('button', 'Run').should('be.disabled')
      
  })
  it('Clears the code output when logging off then logging in again', () => {
      cy.get("textarea[placeholder='Write your Cypress code here...']")
        .type('cy.visit()')
      cy.contains('button', "Run").click()

      cy.get("#outputArea", { timeout: 6000 })
        .should('contain', 'Success:')
        .and('contain', 'cy.visit() // Visited URL')
        .and('be.visible')

      cy.get('#sandwich-menu').click()
      cy.contains('button', 'Logout').click()
      cy.contains('button', 'Login').click()

      cy.get('#outputArea').should('have.value', "")
                //.should('not.contain, "cy,visit()")

  })
  it("doesn't show the cookie consent banner on the login page", () => {
    cy.clearAllLocalStorage()

    cy.reload()

    cy.contains('button', 'Login').should('be.visible')
    cy.get('#cookieConsent').should('not.be.visible')
  })

})
  
  describe("Cypress simulador - Cookies consent", () => {
    beforeEach(() => {
      cy.visit('./src/index.html?skipCaptcha=true')
      cy.contains('button', 'Login').click()
    })
   it('declines on the cookies usage', () => {
    cy.get('#cookieConsent')
      .as("cookieConsentBanner")
      .find("button:contains('Decline')")
      .click()

    cy.get("@cookieConsentBanner").should('not.be.visible')
    cy.window()
      .its('localStorage.cookieConsent')
      .should('be.equal', "declined")
  })
  })
  describe('Cypress Simulator - Captcha', () => {

  beforeEach(() => {
      cy.visit('./src/index.html', {
        onBeforeLoad(win){
          win.localStorage.setItem("cookieConsent", "accepted")
          cy.get('form > button').click()
      } })
          
    })
  it.only("disables the captcha verify button when no answer is provided or it's cleared", () => {
      cy.contains('button', "Verify").should('be.disabled')
      cy.get('#captchaInput').type('2')
      cy.contains('button', "Verify").should('be.enabled')
      cy.get('#captchaInput').clear()
      cy.contains('button', "Verify").should('be.disabled')
  })
  it.only('shows an error on a wrong captcha answer and goes back to its initial state', () => {
      cy.get('#captchaInput').type('100')
      cy.contains('button', "Verify").click()

      cy.contains('.error', 'Incorrect answer, please try again.')
        .should('be.visible')
      cy.get('#captchaInput')
        .should('have.value', "")
      cy.contains('button', "Verify").should('be.disabled')   
  })
    })
