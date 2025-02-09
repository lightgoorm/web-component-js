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
 * -----  
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