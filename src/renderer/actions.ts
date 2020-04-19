import { SourcePluginStatusType } from '../commons/source'

export enum Actions {
  INIT,
  create_source,
  created_source,
  destroy_source,
  destroyed_source,
  config_source,
  update_status,
  update_meta,
  start_publish,
  stop_publish,
  data_arrived,
  error_arrived,
}

export class SourceAction {
  static created(
    plugin_uuid: string,
    plugin_name: string,
    config: any,
    status: SourcePluginStatusType
  ) {
    return {
      type: Actions.created_source,
      payload: {
        plugin_uuid,
        plugin_name,
        config,
        status,
      },
    }
  }

  static config(plugin_uuid: string, config: any) {
    return {
      type: Actions.config_source,
      payload: {
        plugin_uuid,
        config,
      },
    }
  }

  static update_status(plugin_uuid: string, status: any) {
    return {
      type: Actions.update_status,
      payload: {
        plugin_uuid,
        update_status: status,
      },
    }
  }
}
