/**
 * -----  1단계 Vanilla JS Store 구성   ------
 * 1. 'state' : 현재 상태를 저장하는 객체 (e.g., `{ count: 0 }` )
 * 2. `mutations` : 상태를 변경하는 함수 집합 ( Vuex처럼 `commit()` 으로 실행)
 * 3. `commit(mutationKey, payload)` : `mutationKey` 에 해당하는 함수를 실행하여 상태 변경
 *
 *
 *
 *
 * **/


export class Store {
    $state;
    #mutations;
    constructor({state, mutations }) {
        this.$state = state;
        this.#mutations = mutations;
    }

    commit(mutationKey, payload){
        this.#mutations[mutationKey](this.$state, payload);
    }
}