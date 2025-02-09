/**
 * -----  1단계 Vanilla JS Store 구성   ------
 * 1. 'state' : 현재 상태를 저장하는 객체 (e.g., `{ count: 0 }` )
 * 2. `mutations` : 상태를 변경하는 함수 집합 ( Vuex처럼 `commit()` 으로 실행)
 * 3. `commit(mutationKey, payload)` : `mutationKey` 에 해당하는 함수를 실행하여 상태 변경
 *
 *----- 2단계  -----
 * 1. getters 추가
 *  - `getters` : 'state` 를 기반으로 값을 계산하는 함수 집합
 *   - `this.$getters`에 모든 `getter`를 추가하여 쉽게 호출 가능 하도록 한다.
 *
 *
 * **/


export class Store {

    $state;
    $getters;

    #mutations;

    constructor({state, mutations, getters }) {
        this.$state = state;
        this.#mutations = mutations;

        // getter를 일반 프로퍼티로 저장하면 초기 상태만 유지되므로 상태 변경 시 반영되지 않음.
        // Object.defineProperty()를 사용하면 항상 최신 state 값을 반영할 수 있어.
        this.$getters = Object.entries(getters)
            .reduce((acc, [key,getter]) => {
                Object.defineProperty(acc, key, {
                    get: () => getter(this.$state)
                });
                return acc;
            }, {});

        // map 버전
        // this.$getters = Object.fromEntries(
        //     Object.entries(getters).map(([key, getter]) => [
        //         key,
        //         Object.defineProperty({}, key, {
        //             get: () => getter(this.$state),
        //             enumerable: true
        //         })[key]
        //     ])
        // );


    }


    commit(mutationKey, payload){
        this.#mutations[mutationKey](this.$state, payload);
    }
}
const testGetter = {
    getter : {
        isEven : state => state % 2 === 0,
        isGreater : state => state % 3 === 0,
    }
}