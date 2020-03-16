export enum Actions {
  INIT,
  create_source,
  created_source,
  destroy_source,
  destroyed_source,
  config_source,
  update_meta,
  start_publish,
  stop_publish,
  data_arrived,
  error_arrived
}

export class SourceAction {
  static created(
    plugin_uuid: string,
    plugin_name: string,
    tab_name: string,
    config: any
  ) {
    return {
      type: Actions.created_source,
      payload: {
        plugin_uuid,
        plugin_name,
        tab_name,
        config
      }
    }
  }

  static config(plugin_uuid: string, config: any) {
    return {
      type: Actions.config_source,
      payload: {
        plugin_uuid,
        config
      }
    }
  }

  // old
  static createPlugin(dispatch: any, ulid: string, plugin_id: string) {
    dispatch({
      type: Actions.created_source,
      payload: {
        plugin_id,
        ulid
      }
    })
  }
  static updateMeta(dispatch: any, ulid: string, meta_props: Object) {
    dispatch({
      type: Actions.update_meta,
      payload: {
        ulid,
        meta_props
      }
    })
  }
}
