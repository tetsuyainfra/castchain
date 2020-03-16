### Just Do It!!!

- 掲示板タイトルの取得
- コメントの取得
- コメントの定期取得
- コメントの定期取得の停止
- 設定の保存
- スレッド一覧の取得
- スレッドの選択

* Material-UI
  - Style (CSS)
    - What is different from makeStyles, createStyles and withStyles ?

- Plugin Structure
  - which better ?
    - EventEmitter ?
    - Callback ?

* add --clear-setting option
  setting.clear() will clear config
  when next startup, user see cleaned config

- Formik
  - Form 使うのにこれ楽そう？
    - createRef にも限界あるよねー

### React Hooks

- React.useReducer
  - 単一コンポーネントないで完結する処理を書く際につかう

```
~ store.js
const MyContext = React.createContext({someValue: 42});

~ component.js


MyCompo = (props) => (
  <MyContext.Consumer>
      {value => <div>{value.state.someValue}</div>} // 42
  </MyContext.Consumer>
)

App = (props) =>{
  <ThemeProvider>
    <MyContext.Provider>
      // Most near Context will be get ( MyContext.Provider)
      <My Compo />
    <MyContext.Provider>
  </ThemeProvider>
}

```

- if useReduser
  User two Context.Provider
  > アプリケーションの state については、props として渡していくか（より明示的）、あるいはコンテクスト経由で渡すか（深い更新ではより便利）を選ぶ余地が依然あります。もしもコンテクストを使って state も渡すことにする場合は、2 つの別のコンテクストのタイプを使ってください — dispatch のコンテクストは決して変わらないため、dispatch だけを使うコンポーネントは（アプリケーションの state も必要でない限り）再レンダーする必要がなくなります。
