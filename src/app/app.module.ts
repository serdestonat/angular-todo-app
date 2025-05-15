import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- Bu satırı ekleyin

@NgModule({
  imports: [
    BrowserModule,
    FormsModule, // <-- Buraya ekleyin
  ],
  // Diğer ayarlar...
})
export class AppModule {}
