import { CommonModule } from "@angular/common";
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip,
  NgApexchartsModule,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: "app-bar-chart-one",
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: "./bar-chart-one.component.html",
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class BarChartOneComponent implements OnInit {
  // @ViewChild("chart") chart!: ChartComponent;

  public series: ApexAxisChartSeries = [
    {
      name: "في الصيانة",
      data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
    },
    {
      name: "جاهز للعمل",
      data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
    },
  ];
  public chart: ApexChart = {
    type: "bar",
    height: 350,
  };
  public plotOptions: ApexPlotOptions = {
    bar: {
      horizontal: false,
      columnWidth: "40%",
    },
  };
  public colors: string[] = ["#092ed5ff", "#29baf8ff"];

  public legend: ApexLegend = {
    show: true,
    position: "bottom",
    fontFamily: "Outfit",
  };
  public dataLabels: ApexDataLabels = {
    enabled: true,
  };
  public xaxis: ApexXAxis = {
    categories: ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  };
  public yaxis: ApexYAxis = {
    title: {
      text: "عدد الاجهزة",
    },
  };
  isRtl: boolean = false;
  public responsive: ApexResponsive[] = [
    {
      breakpoint: 1024,
      options: {
        chart: {
          height: 300,
        },
        legend: {
          position: "bottom",
        },
      },
    },
    {
      breakpoint: 768, // Mobiles
      options: {
        chart: {
          height: 250,
          width: 350,
        },
      },
    },
  ];
  ngOnInit() {
    this.isRtl = localStorage.getItem("lang") !== "en";
    if (this.isRtl) {
      this.xaxis.categories = [
        "فبراير",
        "مارس",
        "أبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
      ];
    }
  }
}
