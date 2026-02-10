describe('template spec', () => {
  
  it('passes', () => {

    cy.visit('./src/index.html?skipCapthc=true')
    cy.contains('button', 'Login')
    
  })


})