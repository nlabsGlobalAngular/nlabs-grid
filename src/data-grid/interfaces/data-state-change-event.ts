import { FilterDescriptor } from "./filter-descriptor";
import { GroupDescriptor } from "./group-descriptor";
import { SortDescriptor } from "./short-operator";

export interface DataStateChangeEvent {
  skip: number;
  take: number;
  sort?: SortDescriptor[];
  filter?: FilterDescriptor[];
  group?: GroupDescriptor[];
}