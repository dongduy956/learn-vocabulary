import PropsEditTable from './PropsEditTable';
import PropsTopic from './PropsTopic';
import PropsWord from './PropsWord';
export default interface PropsEditTableWord extends PropsEditTable<PropsWord> {
    topics: Array<PropsTopic>;
}
