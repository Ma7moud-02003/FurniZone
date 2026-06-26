import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Orders } from '../../Core/Services/orders';
import { Subscription } from 'rxjs';
import {  Order } from '../../Models/Order';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-orders',
  imports: [CommonModule,RouterModule],
  templateUrl: './my-orders.html',
  styleUrl: './my-orders.css',
})
export class MyOrders implements OnInit,OnDestroy{
  myOrders=signal<Order[]>([]);
  orderId=signal<string>('');
  ngOnInit(): void {
    this.getMyOrders()
  }
  private orderService=inject(Orders);
 private subs=new Subscription();
  getMyOrders(){
this.subs.add(
  this.orderService.getMyOrders().subscribe({
    next:(res:any)=>{
      console.log(res);
    const data=res.data;
    if(data){
      this.orderId.set(data[0].id);
      console.log(this.orderId());
      
    this.myOrders.set(data);
    }
    }
  })
)
  }
  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
