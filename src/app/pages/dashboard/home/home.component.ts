import { CommonModule, DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { SharedUiModule } from "../../../shared/components/shared-ui.module";
import { RadialChartComponent } from "../../../shared/components/charts/radial-chart/radial-chart.component";
import { LookupsService } from "../../../shared/services";
import { BarChartOneComponent } from "../../../shared/components/charts/bar/bar-chart-one/bar-chart-one.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  imports: [
    SharedUiModule,
    CommonModule,
    RadialChartComponent,
    BarChartOneComponent,
    DatePipe,
  ],
})
export class HomeComponent implements OnInit {
  data: any;
  dataPieChart: any = {};
  constructor(public LookupService: LookupsService) {}

  ngOnInit(): void {
    this.getDashboardData();
  }

  getDashboardData() {
    this.LookupService.getDashboard().subscribe({
      next: (res) => {
        if (res.data) {
          this.data = res.data;
          console.log(this.data);

          this.dataPieChart = [
            this.data?.total_opened_orders,
            this.data?.in_progress_orders,
            this.data?.total_hold_orders,
            this.data?.total_completed_orders,
            this.data.total_closed_orders,
          ];
        }
      },
    });
  }

  hasSomethingAfterDevices(url: string): boolean {
    const match = url.match(/\/devices\/(.+)/);
    return !!match && match[1].trim().length > 0;
  }
}
