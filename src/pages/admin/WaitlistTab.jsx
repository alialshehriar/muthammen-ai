import { Card } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.jsx';
import {
  Download, Search, Filter, X, Mail, Phone, MapPin, Calendar, Gift
} from 'lucide-react';

const WaitlistTab = ({
  waitlist,
  allWaitlist,
  searchTerm,
  setSearchTerm,
  cityFilter,
  setCityFilter,
  rewardFilter,
  setRewardFilter,
  uniqueCities,
  uniqueRewards,
  exportToCSV,
  getRewardIcon,
  getRewardColor,
  loading
}) => {
  const clearFilters = () => {
    setSearchTerm('');
    setCityFilter('');
    setRewardFilter('');
  };

  const hasFilters = searchTerm || cityFilter || rewardFilter;

  return (
    <>
      <Card className="p-6">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">قائمة الانتظار</h2>
              <p className="text-sm text-muted-foreground mt-1">
                إجمالي المسجلين: {allWaitlist.length}
              </p>
            </div>
            <Button onClick={exportToCSV} variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              تصدير CSV
            </Button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم، البريد، أو الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>

            {/* City Filter */}
            <div>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">جميع المدن</option>
                {uniqueCities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Reward Filter */}
            <div>
              <select
                value={rewardFilter}
                onChange={(e) => setRewardFilter(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">جميع المكافآت</option>
                {uniqueRewards.map(reward => (
                  <option key={reward} value={reward}>
                    {reward === 'bronze' && 'برونزي'}
                    {reward === 'silver' && 'فضي'}
                    {reward === 'gold' && 'ذهبي'}
                    {reward === 'diamond' && 'ماسي'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          {hasFilters && (
            <div className="flex items-center gap-2">
              <Button
                onClick={clearFilters}
                variant="ghost"
                size="sm"
                className="gap-2"
              >
                <X className="w-4 h-4" />
                مسح الفلاتر
              </Button>
              <span className="text-sm text-muted-foreground">
                عرض {waitlist.length} من {allWaitlist.length}
              </span>
            </div>
          )}

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">المستخدم</TableHead>
                  <TableHead className="text-right">المدينة</TableHead>
                  <TableHead className="text-right">التواصل</TableHead>
                  <TableHead className="text-right">المكافأة</TableHead>
                  <TableHead className="text-right">التاريخ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      جارٍ التحميل...
                    </TableCell>
                  </TableRow>
                ) : waitlist.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      لا توجد نتائج
                    </TableCell>
                  </TableRow>
                ) : (
                  waitlist.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name || 'غير محدد'}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {item.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          {item.city || 'غير محدد'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm flex items-center gap-1">
                          <Phone className="w-3 h-3 text-muted-foreground" />
                          {item.phone || 'غير محدد'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.reward_tier ? (
                          <Badge className={getRewardColor(item.reward_tier)}>
                            {getRewardIcon(item.reward_tier)}
                            <span className="mr-1">
                              {item.reward_tier === 'bronze' && 'برونزي'}
                              {item.reward_tier === 'silver' && 'فضي'}
                              {item.reward_tier === 'gold' && 'ذهبي'}
                              {item.reward_tier === 'diamond' && 'ماسي'}
                            </span>
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">بدون مكافأة</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-muted-foreground" />
                          {item.created_at ? new Date(item.created_at).toLocaleDateString('ar-SA') : 'غير محدد'}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </>
  );
};

export default WaitlistTab;

