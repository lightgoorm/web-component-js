import Storage from '../storage/index.js';

/**
 * -----  요구 사항   ------
 * 1. 상태를 관리할 수 있어야한다.
 * 2. 상태를 변경할 수 있는 기능이 필요하다.
 * 3. 특정 계사된 값(computed, getters) 를 쉽게 가져올 수 있어야 한다.
 * 4. 상태가 변경되면 UI가 자동으로 업데이트되어야 한다.
 * 5. 상태를 localStorage에 저장하여 새로고침 후에도 유지될 수 있어야 한다.
 *
 *
 *
 * ----- 참고 사항 ------
 * VueX 기반의 클래스 및 변수명으로 구성
 * '#' 기호는 클래스 내부에서만 사용 가능 ( private 속성 )
 * '$' 기호는 중요한 퍼블릭 속성이라는 의미 ( Vue 스타일의 컨벤션)
 *
 * **/
export const Store = class {

    $state;
    $getters;
    #mutations;
    #observing;
    #persistentKey;

    constructor({ state, mutations, getters, persistentKey = null }) {
        this.$state = Storage.get(persistentKey, state);
        this.#persistentKey = persistentKey;
        this.#mutations = mutations;
        this.$getters = Object.entries(getters)
            .reduce((getters, [key, getter]) => {
                Object.defineProperty(getters, key, {
                    get: () => getter(this.$state)
                })
                return getters;
            }, {});
        this.#observing = new Set();
    }

    addObserver (...components) {
        components.forEach(component => this.#observing.add(component));
    }

    commit (mutationKey, payload) {
        const newState = { ...this.$state };
        this.#mutations[mutationKey](newState, payload);
        this.#setState(newState);
    }

    #setState (newState) {
        this.$state = { ...newState };
        Storage.set(this.#persistentKey, this.$state);
        this.#observing.forEach(component => component.$render());
    }
}