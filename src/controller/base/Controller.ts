import ControllerResponse from './ControllerResponse';

export default interface Controller {
  /**
     * throws: @Error
     */
  handle(): Promise<ControllerResponse<unknown>>;
}
