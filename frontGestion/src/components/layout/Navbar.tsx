import { LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/useAuth';

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { logout } = useAuth();

  const handleChangeLanguage = (lang: 'es' | 'en' | 'pt') => {
    void i18n.changeLanguage(lang);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <h1 className="text-lg font-semibold">{t('app.name')}</h1>
      <div className="flex items-center gap-2">
        <Select
          value={
            i18n.language.startsWith('en')
              ? 'en'
              : i18n.language.startsWith('pt')
              ? 'pt'
              : 'es'
          }
          onValueChange={(value) =>
            handleChangeLanguage(value as 'es' | 'en' | 'pt')
          }
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Idioma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="es">Español</SelectItem>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="pt">Português</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() => void logout()}
          title={t('auth.logout')}
          aria-label={t('auth.logout')}
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};

