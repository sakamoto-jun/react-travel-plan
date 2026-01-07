import { addDays, format } from 'date-fns';

describe('여행 계획 페이지', () => {
  it('여행 일정을 만들 수 있어야 한다.', () => {
    cy.visit('/plan/seoul');

    //여행 기간 선택하기
    const DATE_FORMAT = 'M월 d일';

    const today = new Date();
    cy.findByRole('gridcell', { name: new RegExp(format(today, DATE_FORMAT)) })
      .should('exist')
      .click();

    const after2Days = addDays(today, 2);
    cy.findByRole('gridcell', { name: new RegExp(format(after2Days, DATE_FORMAT)) })
      .should('exist')
      .click();

    cy.findByRole('button', { name: '선택' }).click();

    //여행 시간 변경하기
    cy.findAllByTestId('time-start').first().type('09:00');
    cy.findByRole('button', { name: '시간 설정 완료' }).click();

    //장소 카테고리 필터링하기
    cy.findAllByTestId('place-card').should('have.length.gt', 0).its('length').as('placeCount');

    cy.findByRole('button', { name: '명소' }).click();
    cy.get('@placeCount').then((placeCount) => {
      cy.findAllByTestId('place-card').should('have.length.lt', placeCount);
    });
    cy.findByRole('button', { name: '명소' }).click();

    cy.findByRole('button', { name: '식당' }).click();
    cy.get('@placeCount').then((placeCount) => {
      cy.findAllByTestId('place-card').should('have.length.lt', placeCount);
    });
    cy.findByRole('button', { name: '식당' }).click();

    //장소 추가하기
    cy.findAllByTitle('plus').each(($el) => {
      cy.wrap($el).click();
    });
    cy.findByRole('button', { name: '다음' }).click();

    //숙소 추가하기
    cy.findAllByTitle('plus').each(($el, index) => {
      if (index < 2) {
        cy.wrap($el).click();
      }
    });
    cy.findByRole('button', { name: '다음' }).click();

    // 일정 확인하기
    cy.url().should('include', '/itinerary/seoul');
    cy.findAllByTestId('itinerary-card').should('have.length.gt', 0);
    cy.findByRole('button', { name: '2일차' }).click();
    cy.findAllByTestId('itinerary-card').should('have.length.gt', 0);
  });
});
