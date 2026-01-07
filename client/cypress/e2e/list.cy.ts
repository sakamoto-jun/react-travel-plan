describe('도시 검색 페이지', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('국내외 필터를 선택했을 때, 필터된 리스트가 잘 노출 되어야 한다.', () => {
    cy.findAllByTestId('city-card').should('have.length.gt', 0).its('length').as('cityCount');

    cy.findByText('국내').click();
    cy.get('@cityCount').then((cityCount) => {
      cy.findAllByTestId('city-card').should('have.length.lt', cityCount);
    });

    cy.findByText('해외').click();
    cy.get('@cityCount').then((cityCount) => {
      cy.findAllByTestId('city-card').should('have.length.lt', cityCount);
    });
  });

  it('검색을 입력했을 때, 검색결과가 잘 노출 되어야 한다.', () => {
    cy.findAllByTestId('city-card').should('have.length.gt', 0);

    cy.findByRole('textbox').clear().type('서울').trigger('compositionend');
    cy.findAllByTestId('city-card').should('have.length', 1);
  });

  it('도시 카드를 클릭했을 때, 도시에 대한 상세정보 모달창이 노출되어야 한다.', () => {
    cy.findAllByTestId('city-card').contains('서울').click();
    cy.findByRole('dialog').should('be.visible').and('contain.text', '서울');
  });

  it('도시 상세정보 모달창에서 일정 만들기 버튼을 클릭했을 때, 일정 페이지로 이동해야 한다.', () => {
    cy.findAllByTestId('city-card').contains('서울').click();
    cy.findByRole('dialog').should('be.visible').and('contain.text', '서울');

    cy.findByText('일정 만들기').click();
    cy.url().should('include', '/plan/seoul');
  });
});
