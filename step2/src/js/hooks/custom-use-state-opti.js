/**
 * UseState 최적화 하기
 * 1. 메모리 관리 개선
 * 2. 불필요한 렌더링 방지
 * 3. 동적 상태 관리
 *
 * --------- 매니저 클래스 ------------
 *
 * WeakMap 을 사용하는 이유는 객체만 사용가능 한것도 있지만, 가비지 컬렉션을 자동으로 해준다.
 * 키를 참조하는 곳이 없으면 자동 삭제 되어 useState 에 알맞음.
 * 보통 임시 데이터 저장에 사용되는데 , 이벤트 리스터를 등록할 때도 특정 객체가 사라지면 자동으로 메모리에서 해제됨.
 *
 * **/

class StateManager {
  constructor() {
    this.states = new WeakMap(); // 컴포넌트별 상태 저장
    this.callbacks = new WeakMap(); // 상태 변경 시 실행할 함수 저장
  }

  init(component, initialState){
    if(!this.states.has(component)){
      this.states.set(component, initialState);
    }
    return this.states.get(component);
  }

  setState(component, newState){
    if(!this.states.has(component)){
      return;
    }

    const prevState = this.states.get(component);
    if(Object.is(prevState, newState)) return;

    this.states.set(component, newState);

    if( this.callbacks.has(component)){
      this.callbacks.get(component)(newState);
    }
  }

  subscribe(component, callback){
    this.callbacks.set(component, callback);
  }
}

const stateManager = new StateManager();

export function useState(initialState, component, callback){
  const state = stateManager.init(component, initialState);

  const setState = (newState) => {
    stateManager.setState(component, newState)
  }

  if(callback){
    stateManager.subscribe(component, callback);
  }

  //commit test2

  return [state,setState];

}
