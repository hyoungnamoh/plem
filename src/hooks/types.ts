import { PlanChart } from 'types/chart';
import { MakeOptional } from 'utils/MakeOptional';
export type PieChartType = MakeOptional<PlanChart, 'id'> & { plans: PieChartPlan[] };

export type PieChartPlan = MakeOptional<PlanChart, 'id'>;
