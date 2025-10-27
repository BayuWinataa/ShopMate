import StatsSection from '@/components/admin/StatsSection';
import OrdersTable from '@/components/admin/OrdersTable';
import ProductsList from '@/components/admin/ProductsList';

export default function AdminDashboardPage() {
	return (
		<div className="space-y-4 md:space-y-6">
			<div>
				<h1 className="text-2xl md:text-3xl font-bold tracking-tight text-violet-900">Dashboard</h1>
				<p className="text-sm text-violet-600 mt-1">Ringkasan data admin</p>
			</div>
			<StatsSection />
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
				<OrdersTable />
				<ProductsList />
			</div>
		</div>
	);
}
