import PuzzleBaseController, {PuzzleBaseOptionModel} from "../BaseClass/PuzzleBaseController";

const {ccclass, property} = cc._decorator;

@ccclass("PuzzleMatchConnectorOptionModel")
export class PuzzleMatchConnectorOptionModel extends PuzzleBaseOptionModel {

    @property()
    test: boolean = true;

}


@ccclass("PuzzleControllerMatchConnector")
export default class PuzzleControllerMatchConnector extends PuzzleBaseController {

    @property({type: PuzzleMatchConnectorOptionModel})
    options: PuzzleMatchConnectorOptionModel = new PuzzleMatchConnectorOptionModel();

}
