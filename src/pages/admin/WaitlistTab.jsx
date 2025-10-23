import { Card } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Badge } from '@/components/ui/badge.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx';
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
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h3 className="font-bold text-xl">قائمة المسجلين</h3>
            <p className="text-sm text-muted-foreground mt-1">
              إجمالي: {allWaitlist.length} | معروض: {waitlist.length}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 w-full lg:w-auto">
            {/* البحث */}
            <div className="relative flex-1 lg:flex-initial">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="بحث بالاسم، البريد، أو الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 w-full lg:w-64"
              />
            </div>

            {/* فلتر المدينة */}
            <Select value={cityFilter} onValueChange={setCityFilter}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="المدينة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع المدن</SelectItem>
                {uniqueCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* فلتر المكافأة */}
            <Select value={rewardFilter} onValueChange={setRewardFilter}>
              <SelectTrigger className="w-full lg:w-40">
                <SelectValue placeholder="المكافأة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع المستويات</SelectItem>
                {uniqueRewards.map(reward => (
                  <SelectItem key={reward} value={reward}>
                    {reward === 'diamond' ? 'ماسي' :
                     reward === 'gold' ? 'ذهبي' :
                     reward === 'silver' ? 'فضي' : 'برونزي'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* مسح الفلاتر */}
            {hasFilters && (
              <Button onClick={clearFilters} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                مسح
              </Button>
            )}

            {/* تصدير */}
            <Button
              onClick={() => exportToCSV(waitlist, 'waitlist')}
              variant="default"
              size="sm"
              disabled={waitlist.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              تصدير CSV
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground py-12">
            جارٍ التحميل...
          </div>
        ) : waitlist.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            {hasFilters ? 'لا توجد نتائج مطابقة للبحث' : 'لا توجد تسجيلات حتى الآن'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">البريد الإلكتروني</TableHead>
                  <TableHead className="text-right">المدينة</TableHead>
                  <TableHead className="text-right">الهاتف</TableHead>
                  <TableHead className="text-right">كود الإحالة</TableHead>
                  <TableHead className="text-right">المُحيل</TableHead>
                  <TableHead className="text-right">عدد الإحالات</TableHead>
                  <TableHead className="text-right">المستوى</TableHead>
                  <TableHead className="text-right">تاريخ التسجيل</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {waitlist.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {item.name || <span className="text-muted-foreground">غير محدد</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{item.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{item.city || 'غير محدد'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm" dir="ltr">{item.phone || 'غير محدد'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                        {item.ref_code}
                      </code>
                    </TableCell>
                    <TableCell>
                      {item.referred_by ? (
                        <code className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-mono">
                          {item.referred_by}
                        </code>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Gift className="w-4 h-4 text-purple-600" />
                        <span className="font-bold">{item.referrals_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRewardColor(item.reward_tier)}>
                        <span className="flex items-center gap-1">
                          {getRewardIcon(item.reward_tier)}
                          {item.reward_tier === 'diamond' ? 'ماسي' :
                           item.reward_tier === 'gold' ? 'ذهبي' :
                           item.reward_tier === 'silver' ? 'فضي' :
                           item.reward_tier === 'bronze' ? 'برونزي' : 'بدون'}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(item.created_at).toLocaleDateString('ar-SA', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </Card>
    </>
  );
};

export default WaitlistTab;

